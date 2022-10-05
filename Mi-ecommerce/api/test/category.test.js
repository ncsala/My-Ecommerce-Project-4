const request = require('supertest');
const {app, server} = require('../../server');
const {generateJWT} = require('../../helpers/generateJWT');
const db = require('../database/models');

