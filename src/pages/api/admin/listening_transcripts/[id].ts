import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/db";
import { ListeningTranscript } from "@/models/ListeningTranscript";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await sequelize.authenticate();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { blanks } = req.body;
    try {
      const transcript = await ListeningTranscript.findByPk(Number(id));
      if (transcript) {
        await transcript.update({ blanks });
        res.status(200).json({ message: 'Updated successfully' });
      } else {
        res.status(404).json({ error: 'Transcript not found' });
      }
    } catch (error) {
      console.error("Error updating transcript:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).end();
  }
}

export default withErrorHandler(handler, "Failed to update transcript");