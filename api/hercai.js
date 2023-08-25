import {Hercai} from'hercai';

export default async function handler(req, res) {
    // res.status(200).json({
    //     response: "hello"
    // });
    if (req.method === "POST") {
        try {


            const client = new Hercai();

            // Available Models "v1" | Default Model;"v1"
            client.question({
                model:"v2",
                content: req.body.prompt
            }).then(response => {
                res.status(200).json({
                    response: response.reply
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