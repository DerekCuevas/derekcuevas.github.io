# FYGT

A blog that writes itself using ChatGPT running on GitHub Actions.

## TODO
- move to main github profile page (new repo), fixes tags?
- rewrite readme (doc the technical design), publish as about page

## Resources
- https://github.com/nektos/act
- https://theanshuman.dev/articles/free-cron-jobs-with-github-actions-31d6
- https://joht.github.io/johtizen/build/2022/01/20/github-actions-push-into-repository.html

## Page Generator

Generates web page content given a topic and topic metadata. A generated page includes the html body, metadata (SEO), a "slug", and tags.

The generator can choose between different generator prompt "templates" that translate well to different categories or writing styles. Each prompt template can have an "author" pseudonym.


## FYGT Site Backend

Adds new pages to the `fygt` static site. Should persist a manifest (sqllite eventually?) of existing pages and page metadata (including published date). Should filter trends to avoid re-publishing similar or same page twice.

## FYGT Static Site

The public facing generated static site. Generated using `Hugo` hosted on `Github Pages`.

Site should include basic analytics. Can include other third-party widgets.

https://github.com/athul/archie
https://gohugo.io/hosting-and-deployment/hosting-on-github/

## Generator Cron

Runs the trends backend, generates pages, and updates the site through the site backend. Hosted on Github Actions and scheduled to run every `12h`.

```sh
deno run --allow-net --allow-write --allow-read --allow-env main.ts
```

## Community Finder

*Version Two*

Searches the web for public forms related to a trend or page (such as a related sub-reddit).

## Community Generator

*Version Two*

Generates community posts for sharing a newly generated page to a related community. 
