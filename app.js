#!/usr/bin/env node

'use strict';

const iTunes  = require('playback');
const Twitter = require('twitter');
const Config  = require(`${process.env.HOME}/.tweet-nowplaying.json`);

let client = new Twitter(Config.keys);

iTunes.currentTrack((track) => {
  let status = Config.format;

  // replace trackName, trackArtist, TrackAlbum
  status = status.replace(/\{name\}/g, track.name)
                 .replace(/\{artist\}/g, track.artist)
                 .replace(/\{album\}/g, track.album);

  // shorten text if greater than 140 chars
  if (status.length > 140) {
    status = `${status.slice(0, 137)}...`;
  }

  // tweet
  client.post('statuses/update', { status }, (error, tweet, response) => {
    // playback module receives track change events.
    // This feature prevents this app from halt.
    // we must kill this app clearly.
    process.exit();
  });
});
