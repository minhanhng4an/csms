import { calendar_v3, google } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path'

import fs from 'fs/promises'


export class GCalService {

    async getGoogleClient(): Promise<JWT> {
        try {
            const credentialsPath = path.join(process.cwd(), 'credentials.json')

            const content = await fs.readFile(credentialsPath, 'utf-8');
            const credentials = JSON.parse(content);
    
            return new JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: [
                    'https://www.googleapis.com/auth/calendar',
                    'https://www.googleapis.com/auth/calendar.events',
                ]
            });
        } catch(error) {
            throw new Error(`Error getting Google Client: ${(error as any).message}`)
        }
        
    }

    async getUpcomingMentorSession(late = false): Promise<calendar_v3.Schema$Event | null> {
        const client = await this.getGoogleClient()

        const calendar = google.calendar({ version: 'v3' });

        const now = new Date()
        let timeMax: string
        let timeMin: string

        if (late) {
            timeMax = now.toISOString()
            timeMin = new Date(now.getTime() - 60 * 60 * 1000).toISOString() // Last one hour
        } else {
            timeMax = new Date(now.getTime() + 60 * 60 * 1000).toISOString() // One hour from now
            timeMin = now.toISOString()
        }
        try {
            const request = {
                'auth': client,
                'q': process.env.CALENDAR_EVENT_NAME,
                'calendarId': process.env.MENTOR_EMAIL,
                'timeMax': timeMax,
                'timeMin': timeMin,
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime',
            };

            const res = await calendar.events.list(request)

            if (!res.data.items) {
                return null
            }

            if (late) {
                // Get latest past event
                return res.data.items[res.data.items.length - 1]
            } else {
                // Get upcoming event
                return res.data.items[0]
            }
        } catch (error) {
            throw new Error(`Error finding upcoming mentor session: ${(error as any).message}`);
        }
    }
}