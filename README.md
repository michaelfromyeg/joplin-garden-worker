# Joplin Garden Worker (Quartz Edition)

Joplin Garden Worker is a tool to export notes from Joplin to build a digital garden website. Unlike the traditional personal blog that publishes a set of articles in a reversed chronological order, the digital garden is a lot like a wiki with evolving ideas connected by links.

**This fork** is intended to integrate well with [Quartz](https://github.com/jackyzha0/quartz), a Hugo-based digital garden tool. Quartz pairs best with Obsidian, but if you (like me) prefer Joplin, this project may be for you.

This tool support exporting to a GitHub Wiki or Hugo Static Site Generator.

Demo sites:

- Hugo: [Unlimited Build Works](https://benlau.github.io/)
- GitHub Wiki: [`benlau.github.io` Wiki](https://github.com/benlau/benlau.github.io/wiki)

- [Joplin Garden Worker (Quartz Edition)](#joplin-garden-worker-quartz-edition)
  - [Features](#features)
  - [Use-cases](#use-cases)
- [Concept](#concept)
  - [Installation](#installation)
  - [Getting Started By a Sample Project](#getting-started-by-a-sample-project)
  - [Obtain the API key](#obtain-the-api-key)
  - [Export the site](#export-the-site)
  - [Advanced Usage](#advanced-usage)
  - [Configuration](#configuration)
  - [config.yaml](#configyaml)
  - [`metadata.yaml`](#metadatayaml)
  - [`hooks.js`](#hooksjs)
  - [Commands](#commands)
    - [Obtain the Joplin API Key](#obtain-the-joplin-api-key)
    - [Update the metadata.yaml](#update-the-metadatayaml)
    - [Exporting the site](#exporting-the-site)

## Features

- Exported tag filtered notes from Joplin
- Export to Hugo / GitHub Wiki
- Support link "transclusion" (...whatever that is)
- Support running custom post-processing scripts
  - e.g., show backlinks on a note

## Use-cases

1. Build digital garden
2. Build a website of books
3. Update the Markdown document inside a software project

## Concept

You need to prepare a project folder with config files to describe what kind of notes will be exported and how it renders the content.

In case you are using the Hugo engine, the flow could be illustrated in the below diagram:

The flow (Hugo):

```mermaid
graph LR
Joplin --> ProjectFolder(<u>Project Folder</u> <br/>config.yaml<br/>metadata.yaml)
ProjectFolder --jgw export--> SiteFolder(<u>SiteFolder</u><br/>contents/**/TITLE/index.md)
SiteFolder --hugo--> StaticSite
```

The Joplin Garden Worker does not provide any pre-built Hugo theme. You are free to choose the theme you like and customize the generation process.

You could find a demo at: [Unlimited Build Works](https://benlau.github.io/)

## Installation

```bash
git clone https://github.com/benlau/joplin-garden-worker.git
cd joplin-garden-worker
npm install -g
```

That will install `jgw` command line program on your machine.

## Getting Started By a Sample Project

To create your digital garden, you need to choose the engine used. Currently, two kinds of engines are supported: GitHub Wiki / Hugo.

And then create a `config.yaml` to store your preferences. You may provide a `hooks.js` to run script during the generation process to customize the behavior.

A sample config for building a Hugo website is available at `samples/hugo`. You need to install the Hugo command line tool first.

[Install Hugo | Hugo](https://gohugo.io/getting-started/installing/)

Preparation:

```bash
cd samples/hugo/beautiful/site
git clone https://github.com/halogenica/beautifulhugo.git themes/beautifulhugo
```

The Usage:

## Obtain the API key

To access your Data in Joplin, you need to get the API KEY. You may run the following commands:

```bash
$ cd samples/hugo/beautiful
> ...
$ jgw auth
> ...
```

And then you should switch to Joplin. It will show a dialog to ask to grant permission for the request if you have web clipper enabled. ([Joplin Web Clipper | Joplin](https://joplinapp.org/clipper/)). Accept the request then it will write a `.auth` file to store the API. If you are holding the project inside a version control system like `git`. Please don't commit this file.

### From within `WSL2`

If you're running this code from within WSL2, you need to be a bit fancy to connect to the Joplin web service.

Firstly, add the following bit to your `.bashrc.` Credit to [this](https://stackoverflow.com/questions/64763147/access-a-localhost-running-in-windows-from-inside-wsl2) Stack Overflow post for the tip.

```sh
export winhost=$(cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }')
if [ ! -n "$(grep -P "[[:space:]]winhost" /etc/hosts)" ]; then
        printf "%s\t%s\n" "$winhost" "winhost" | sudo tee -a "/etc/hosts"
fi
```

Now `winhost` is `localhost`.

Once Joplin is running, you should be able to run the following command.

```sh
$ nmap -p 41184 winhost -Pn
Starting Nmap 7.80 ( https://nmap.org ) at 2023-07-01 11:06 PDT
Nmap scan report for winhost (172.28.48.1)
Host is up.

PORT      STATE    SERVICE
41184/tcp filtered unknown

Nmap done: 1 IP address (1 host up) scanned in 2.05 seconds
```

This is good, now we can connect. (That was a lie... it still didn't work.)

Instead, try re-opening the folder from Windows. Trust the repository.

Make sure `nvm` is installed on your Windows machine.

Okay, actually my `nvm` was broken. Just run `choco install nodejs`.

Run `npm i --global` from the base, and then `npm link`.

Run `refreshenv` in PowerShell (or equivalent in other terminals).

`jgw` should now be accessible!

## Export the site

```bash
$ cd samples/hugo/beautiful
$ jgw export site
1 notes exported
0 resources exported
```

Run the above command to export the site to hugo. If it is showing `0 notes exported`, it is alright because you may not have any notes with the tag "jgw-demo". Open the Joplin , and random tag a note you would like to export. Then rerun the above command.

```sh
$ cd samples/hugo/beautiful/site
hugo server -w
```

Open this [URL](http://localhost:1313/blog) in your browser. It should show a website with notes exported from your Joplin inside the blog section.

### With Quartz

Here's where things will get a bit weird. Head to the Quartz content section and run `jgw export site`. Let's see what breaks.

Switch over to the Quartz repository, which should also be based in Windows, if you followed the WSL section above.

## Advanced Usage

- How to filter private comment
- Set slug
- Export feature image

The document is incomplete. In case you need a feature not mentioned in this README. Please feel free to ask via the GitHub Issues.

## Configuration

The Joplin Garden Worker supports exporting a site and customizing the generation process. It needs to hold the configuration and script inside a project folder.

Each project should contain at least 3 files:

## config.yaml

Example:

```yaml
engine: hugo
hugoOptions:
  outputAsFolder: true
defaultFolder: garden
stripHtmlComments: true
includeTags:
  - jgw
```

- `engine`: The type of engine used. Available choices: `githubwiki`/`hugo`
- `inclucedTags`: It is an array of tags. Only the note with the tags will be exported.
- `hugoOptions`: Hugo specific options.
  - `outputAsFolder`: A option for Hugo only. By default, the garden worker generates a note in the format of `${folder}/${note-title}.md`. If `outputAsFolder` was set, it will become `${folder}/${note-title}/index.md`. It is designed to support Hugo theme that will show the featured image. The default value is true.
- `defaultFolder`: The default output folder of a note.
- `stripHtmlComments`: If it is true, HTML comment blocks are removed from the exported note.

## `metadata.yaml`

This file contains the exported note's metadata. For example, garden worker generate the URL of an exported note according to the title. To perverse the URL to be changed by the title modification, garden worker stores the URL into this file.

## `hooks.js`

You may customize the generation process by writing your own script inside hooks.js

Example Usage:

- Set tags of the exported note
- Re-render the content (e.g., remove private note)
- Append a footer to a specific note with a specific tag

[[Link to Example]]

## Commands

### Obtain the Joplin API Key

```bash
jgw auth
```

### Update the metadata.yaml

The `metadata.yaml` stores the metadata of the exported notes. Sometimes you may not want to export the notes directly and only updates the metadata.yaml to have a preview of changes. You may run this command:

```bash
jgw update
```

### Exporting the site

This command exports the notes to the target folder, and it will also update the `metadata.yaml`.

```bash
jgw export OUTPUT_FOLDER
```
