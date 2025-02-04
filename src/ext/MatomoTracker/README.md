# Matomo tracker

Google Analytics alternative that protects your data and your customers' privacy. A powerful web analytics platform that gives you 100% data ownership. More info: https://matomo.org/

## Enabling the feature

Once enabled in bootstrap.json with:

    "sandboxFeatures": {
        "MatomoTracker": true
    }

As well as tracker configuration provided in bootstrap.json with:

    "matomo": {
        "src": "<url with Matomo script>",
    }

MatomoTracker feature can be wired in as:

    <SandboxFeature
        feature="MatomoTracker"
    />

## Cookie consent management

Cookie consent can be managed, for example, by using the CookieInformation sandbox feature.
