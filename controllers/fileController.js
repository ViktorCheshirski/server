const config = require('config')
const EasyYandexS3 = require("easy-yandex-s3");
const connection = new require("../connection").connection

const s3 = new EasyYandexS3({
    auth: {
        accessKeyId: "YCAJEt3kVCrqCjKCR0Pgphq9G",
        secretAccessKey: "YCNjcNa-CJGW56dFT2EN00c33-lBYwhxcRtHORj3",
    },
    Bucket: "diplom-prototype",
    debug: false 
});

class FileController {
    async uploadFile(req, res) {
        try {
            const title = req.body.title;
            const artist = req.body.artist;
            const master_id = req.user.id;
            const visibility = req.body.visibility;
            var source = await s3.Upload({
                buffer: req.files.file.data
            },"/");
            const buff = Buffer.from(req.body.image, 'base64')
            var image = await s3.Upload( {
                buffer: buff
            },  "/" );
            connection.execute("INSERT INTO tracks (title, artist, source, image, master_id, visibility) VALUES (?, ?, ?, ?, ?, ?)",
            [title, artist, source.Location, image.Location, master_id, visibility ? 1 : 0]);
            const sql = "insert into id_"+ master_id +" (track_id) (SELECT MAX(id) FROM tracks where master_id="+ master_id +")";
            connection.execute(sql);
            
            res.json(source)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }

    async searchFile(req, res) {
        try {
            const searchName = req.query.search
            let files = await File.find({user: req.user.id}) //тут sql
            files = files.filter(file => file.name.includes(searchName))
            return res.json(files)
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Search error'})
        }
    }

    async mainFile(req, res) {
        try {
            let files = []
            const waiter = await connection.execute("SELECT * FROM tracks where master_id=0",
            function(err, results, fields) {
                files = results
                return res.json(files)
            });
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Main page loading failed'})
        }
    }

    async getFiles(req, res) {
        try {
            let files = []
            const sql = "select * from tracks where id in (SELECT track_id FROM id_"+ req.user.id +" where main_playlist = true)"
            const waiter = await connection.execute(sql,
            function(err, results, fields) {
                files = results
                return res.json(files)
            });
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Can not get files"})
        }
    }
}

module.exports = new FileController()