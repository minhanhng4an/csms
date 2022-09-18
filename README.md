# CoderSchool Mentor Session CLI 

WIP - THE PACKAGE IS CURRENTLY UNDER DEVELOPMENT. SOME FEATURES MIGHT NOT WORK AS EXPECTED.

CLI to quickly launch upcoming Mentor session's Google Meet link and prefill mentee email in Session Claim form.

## Usage

```
~$ csms 
COMMANDS:
	start	              Start upcoming mentor sesion
	start --late	      Start nearest past mentor sesion
```

Note:

- **Upcoming session** is defined as the earliest session within 1 hour from now.
- **Nearest past session** is defined as the latest session within the past 1 hour.

## Installation

1. Create `.env` file in `csms/`

```
CALENDAR_EVENT_NAME="Mentor session event name on your Google Calendar"

GFORM_URL="Link to Session Claim form (end in /viewform"

GFORM_METEE_EMAIL_ENTRY="entryId of Mentee Email field on Session Claim form. Format: entry.xxxxxxxxxx (Inspect Session Claim form to find this)"

GFORM_COURSE_ENTRY="Same as above, but for course (class) field"

MENTOR_EMAIL="Your email"

MENTOR_GOOGLE_USER="Your Google user if you are using multiple Google accounts. Open Google Meet, select your mentor email account and find this number authuser param in the url "
```

2. [Get Google Service Account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys). Rename file to `credentials.json` and put in `csms/`

3. (Optional) Create `menteeEmails.json` in in `csms/` if you have students who use different email accounts to register for the course and in Google Calendar mentor session events. Format:
```json
{
    "email_in_db@domain.com": "email_in_gcal@domain.com"
}
``` 

4. Install dependenices
```
npm install
```

5. Build
```
npm run build
```

6. Install package as global
```
npm install -g .
```

7. Run CLI
```
csms start
```

## TODO
- [ ] Add more error handlers
- [ ] Implement ESLint
- [ ] Write unit tests
- [ ] Add config commands
- [ ] Test in different OS