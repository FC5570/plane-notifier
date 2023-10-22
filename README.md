# plane-notifier
Notifies you on WhatsApp when planes are flying over certain coordinates within a specific radius.

## Setup
1. Install the dependencies, use `yarn install`.
2. Head over to `config.json`, and fill in the details, read the Configuration section below for more info.
4. Run the bot using `node src/index.js`.

## Configuration
1. `lat`: The latitude of the location
2. `lon`: The longitude of the location
3. `radius`: The radius of search. This must be in **nautical miles**.
4. `phoneNumber`: The phone number of the person you wish to send the notifications to. The phone number must contain the country code at the start, and `@c.us` at the end. For example: 911234567890@c.us, the country code is 91, everything after is the phone number, with `@c.us` after the phone number.