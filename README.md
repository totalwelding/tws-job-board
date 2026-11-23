# TWS Job Board

Crew app for Total Welding Solutions: clock on/off with GPS, job cards (site contact, plan, consumables, before/during/after photos), week calendar, and under More: tickets & licence expiry reminders, repairs (with photos), to-buy list, ideas, and the manager tab (hours, $, expected hours, timesheets, crew access).

- Live at https://totalwelding.github.io/tws-job-board/
- Sign-in: Google. New crew sign in, then a manager lets them in under **Manager → Crew access**. Owner: luke@totalwelding.com.au.
- Data: Firebase project `tws-job-board` (Firestore, Sydney). Security rules are in `firestore.rules`. Firebase config is in `config.js`.
- Crew Board (hostel) tracks jobs only, no hours. All hours live here.

## Setup (one-off)
1. Firebase console → Add project `tws-job-board` (Google Analytics off).
2. Build → Firestore → Create database, location `australia-southeast1` (Sydney), production mode. Paste `firestore.rules` into Rules → Publish.
3. Build → Authentication → Get started → Google → Enable (support email luke@totalwelding.com.au). Settings → Authorised domains → add `totalwelding.github.io`.
4. Project settings → Your apps → Web (</>) → register "TWS Job Board" → copy the config into `config.js`.
5. Photos to Google Drive: script.google.com (as luke@totalwelding.com.au) → New project → paste `drive-photos.gs` → Deploy → Web app, Execute as **Me**, access **Anyone** → copy the URL into `PHOTO_SCRIPT_URL` in `config.js`. Photos land in Drive › **TWS Job Board Photos** › `TWS-0001 Curtis Ferry` › Before / During / After, and › Repairs. If this is blank or Drive can't be reached, full photos are kept in Firestore instead.
6. GitHub: new public repo `totalwelding/tws-job-board`, push these files, Settings → Pages → Deploy from branch `main` / root.

## Who sees what
- Crew: jobs, plan, hours, calendar, consumables and their costs.
- Managers only (enforced by the rules): `money/*` (expected hours, quotes, charge rates, labour cost), crew access, fixing timesheets.

## Data shape (for the owner dashboard)
All dates are `YYYY-MM-DD` (Brisbane local). Times are ISO UTC. Money is $ ex GST as numbers. Every record has `business: "TWS"`, `jobCode` (e.g. `TWS-0001`) and `site`.

| Collection | Fields |
|---|---|
| `jobs/{tws-0001}` | code, title, client, site, address, contactName, contactPhone, status (Active/Planned/On hold/Done), start, end, crew[], plan[{t,done,by,at}], lat, lng, radius, notes |
| `shifts/{id}` | date, who, email, jobId, jobCode, site, on, off, breakMin, hours, onLoc/offLoc {lat,lng,acc,dist,onSite}, note |
| `consumables/{id}` | date, jobId, jobCode, site, item, qty, unit, cost, who |
| `calendar/{date_who_job}` | date, who, jobId, jobCode, site, hrs (planned), note |
| `totals/{date}` | **dashboard reads this**: hours, hoursByJob{code:h}, hoursByWho{name:h}, consumables, consumablesByJob{code:$}, jobs{code:site}, shifts |
| `tickets/{id}` | who, email (blank = company), type, expiry, remind (days), num, note |
| `ideas/{id}` | title, cat, detail, jobId, jobCode, who, at, status (new/trying/adopted/no), votes[], reply |
| `repairs/{id}` | item, problem, down (can't use), jobId, jobCode, who, at, status (reported/fixing/parts/fixed/gone), fixNote, cost |
| `tobuy/{id}` | item, qty, unit, kind (consumable/tool/material/ppe), urgency (today/week/whenever), jobId, jobCode, supplier, who, at, status (needed/ordered/got), repairId |
| `photos/{id}` | target (job/repair), targetId, jobCode, stage (before/during/after/damage), thumb, who, date, at. driveId (full image in Luke's Drive) or full image in `photoData/{id}` |
| `money/{jobId}` | managers: expectedHrs, pricing (fixed/hourly), quote, chargeRate, markup. `money/_rates`: labourCost, chargeRate |
