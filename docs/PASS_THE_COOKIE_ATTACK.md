Always use https - and https only cookies.

Save the cookie in a storage system (nosql/cache system/db) and set it a TTL(expiry).

Never save the cookie as received into the storage but add salt and hash it before you save or check it just like you would with a password.

Always clean up expired sessions from the store.

Save issuing IP and IP2Location area. So you can check if the IP changes.

Exclusive session, one user one session.

Session collision detected (another ip) kick user and for next login request 2 way authentication, for instance send an SMS to a registered phone number so he can enter it in the login.

Under no circumstances load untrusted libraries. Better yet host all the libraries you use on your own server/cdn.

Check to not have injection vulnerabilities. Things like profiles or generally things that post back to the user what he entered in one way or another must be heavily sanitized, as they are a prime vector of compromise. Same goes for data sent to the server via anything: cookies,get,post,headers everything you may or may not use from the client must be sanitized.

Should I mention SQLInjections?

Double session either using a url session or storing an encrypted session id in the local store are nice and all but they ultimately are useless as both are accessible for a malicious code that is already included in your site like say a library loaded from a domain that that has been highjacked in one way or another(dns poison, complomised server, proxies, interceptors etc...). The effort is valiant but ultimately futile.

There are a few other options that further increase the difficulty of fetching and effectively using a session. For instance You could reissue session id's very frequently say reissue a session id if it is older then 1 minute even if you keep the user logged in he gets a new session id so a possible attacker has just 1 minute to do something with a highjacked session id.

Even if you apply all of these there is no guarantee that your session won't be highjacked one way or the other, you just make it incredibly hard to do so to the point of being impractical, but make no mistake making it 100% secure will be impossible.

There are loads of other security features you need to consider at server level like execution isolation, data isolation etc. This is a very large discussion. Security is not something you apply to a system it must be how the system is built from ground up!
