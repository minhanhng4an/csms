import open from 'open'

export class BrowserService {

    /** Get prefilled Google Form URL */
    buildGoogleFormURL(menteeEmail: string, course: string): string {
        const {
            GFORM_URL,
            GFORM_METEE_EMAIL_ENTRY,
            GFORM_COURSE_ENTRY
        } = process.env

        return `${GFORM_URL}?${GFORM_METEE_EMAIL_ENTRY}=${menteeEmail}&${GFORM_COURSE_ENTRY}=${course}`
    }

    /** Get Google Meet URL with correct Google user */
    buildGoogleMeetURL(url: string):string {
        return `${url}?pli=1&authuser=${process.env.MENTOR_GOOGLE_USER}`
    }

    async openSessionClaimForm(prefill: {
        menteeEmail: string,
        course: string
    }): Promise<void> {

        const { menteeEmail, course } = prefill

        const formUrl = this.buildGoogleFormURL(menteeEmail, course)

        await open(formUrl, {
            app: {
                name: open.apps.chrome
            }
        })
    }

    async openGoogleMeetLink(url: string): Promise<void> {

        const gMeetUrl = this.buildGoogleMeetURL(url)

        await open(gMeetUrl,  {
            app: {
                name: open.apps.chrome
            }
        })
    }
}
