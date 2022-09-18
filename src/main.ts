import * as dotenv from 'dotenv'
import chalk from 'chalk';
import fs from 'fs/promises'
import path from 'path';

import BrowserService from './services/browser'
import GCalService from './services/gcal'


dotenv.config()

enum CourseName {
    'DS' = 'Data+Science',
    'Web' = 'Full-stack+Web'
}

export class CSMS {

    private browserService: BrowserService
    private gCalService: GCalService
    private menteeEmailMapper: Map<string, string> | null

    constructor() {
        this.browserService = new BrowserService()
        this.gCalService = new GCalService()
        this.menteeEmailMapper = null
    }

    /** 
     * Get correct mentee email for GForm
     * in case mentee uses different email for GCal
     */
    async initializeMenteeEmailMapper() {
        const menteeEmailsPath = path.join(process.cwd(), 'menteeEmails.json')
        try {
            await fs.access(menteeEmailsPath)
            const content = await fs.readFile(menteeEmailsPath, 'utf-8')
            this.menteeEmailMapper = new Map(Object.entries(JSON.parse(content)))
        } catch {
            return
        }            
    }

    getMenteeEmail(calEmail: string): string {
        if (this.menteeEmailMapper && this.menteeEmailMapper.has(calEmail)) {
            return this.menteeEmailMapper.get(calEmail)!
        } else {
            return calEmail
        }
    }

    async startMentorSession(late = false) {

        await this.initializeMenteeEmailMapper()

        console.log(chalk.blue("Finding your upcoming mentor session..."))

        const upcomingMentorSession = await this.gCalService.getUpcomingMentorSession(late)

        if (!upcomingMentorSession) {
            console.log('No upcoming mentor session found.')
            return
        }
        console.log('Session Found!')

        try {
            const attendees = upcomingMentorSession.attendees!.filter((a) => a.email != process.env.MENTOR_EMAIL)
            const sessionURL = upcomingMentorSession.hangoutLink!

            // Open prefilled Session Claim form for each mentee
            attendees.forEach(async (attendee) => {
                await this.browserService.openSessionClaimForm({
                    menteeEmail: this.getMenteeEmail(attendee.email!),
                    course: upcomingMentorSession.organizer!.displayName!.startsWith('DS') ? CourseName.DS : CourseName.Web
                })

            console.log(chalk.blue('Starting session...'))
            console.log('Session URL: ' + chalk.green(sessionURL))
        
            await this.browserService.openGoogleMeetLink(sessionURL)
        })
        
        } catch(error) {
            throw new Error(`Error starting session: ${(error as any).message}`)
        }   
    }
}

export const startSession = async (late = false) => {
    const csms = new CSMS()
    csms.startMentorSession(late)
}