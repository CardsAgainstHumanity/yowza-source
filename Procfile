web: bin/heroku-web
worker-scheduler: bundle exec sidekiq -q scheduler
worker-user-priority-0: env DB_POOL=50 bundle exec sidekiq -c 50 -q default,8
worker-user-priority-1: bundle exec sidekiq -q default,8
worker-mailer: env DB_POOL=20 bundle exec sidekiq -c 20 -q mailers,2
worker-pull: env DB_POOL=10 bundle exec sidekiq -c 10 -q pull
worker-deprioritized: bundle exec sidekiq -q push,6 -q ingress,4

# For the streaming API, you need a separate app that shares Postgres and Redis:
#
# heroku create
# heroku buildpacks:add heroku/nodejs
# heroku config:set RUN_STREAMING=true
# heroku addons:attach <main-app>::DATABASE
# heroku addons:attach <main-app>::REDIS
#
# and let the main app use the separate app:
#
# heroku config:set STREAMING_API_BASE_URL=wss://<streaming-app>.herokuapp.com -a <main-app>
