import {Hercai} from 'hercai';

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {


            const client = new Hercai();

            // Available Models "v1" | Default Model;"v1"
            client.drawImage({model:"v2",prompt:req.body.prompt}).then(response => {
                res.status(200).json({
                    response: response.url
                });
                });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                error: "Internal server error"
            });
        }
    } else {
        res.status(403).json({
            message: "Not for this"
        })
    }
}