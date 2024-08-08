'use strict';

const express = require('express');
const router = new express.Router();

/**
 * @swagger
 *
 * schemes:
 *  - "https"
 *  - "http"
 *
 * /public-profiles:
 *  get:
 *   tags:
 *    - Access Management
 *   description: Get Public profiles of the the users 
 *   operationId: getPublicProfiles  
 *   parameters:    
 *    - in: query
 *      name: userId
 *      description: "Get posts"
 *      required: true
 *      type: string
 *      exmaple: "112sadad32dsa362tdhsa"   
 *   responses:
 *     200:
 *      description: Public profiles      
 * 
 * /follow:
 *  post:
 *   tags:
 *    - Access Management
 *   description: API for following the User
 *   operationId: followUser     
 *   parameters:
 *    - in: body
 *      name: data
 *      description: "id - loggedIn userID, userId - following userId"
 *      required: true
 *      schema:
 *       $ref: '#/definitions/followUser'
 *   responses:
 *     200:
 *      description: followed User
 * 
 * /unfollow:
 *  post:
 *   tags:
 *    - Access Management
 *   description: API for following the User
 *   operationId: unfollowUser     
 *   parameters:
 *    - in: body
 *      name: data
 *      description: "id - loggedIn userID, userId - following userId"
 *      required: true
 *      schema:
 *       $ref: '#/definitions/followUser'
 *   responses:
 *     200:
 *      description: Unfollowed User
 * 
 * /mood:
 *  post:
 *   tags:
 *    - Access Management
 *   description: API setting user mood
 *   operationId: setMood     
 *   parameters:
 *    - in: body
 *      name: data
 *      description: "Setting mood"
 *      required: true
 *      schema:
 *       $ref: '#/definitions/mood'
 *   responses:
 *     200:
 *      description: User Mood
 * 
 * /mood/{userId}:
 *  get:
 *   tags:
 *    - Access Management
 *   description: API setting user mood
 *   operationId: getMood     
 *   parameters:
 *    - in: path
 *      name: userId
 *      description: "User Id"
 *      required: true
 *      type: string
 *      exmaple: "5e70cf17d67dff48877c1136"
 *   responses:
 *     200:
 *      description: User Moods
 * 
 *  put:
 *   tags:
 *    - Access Management
 *   description: API update mood
 *   operationId: editMood     
 *   parameters:
 *    - in: path
 *      name: userId
 *      description: "User Id"
 *      required: true
 *      type: string
 *      exmaple: "5e70cf17d67dff48877c1136"
 *    - in: body
 *      name: data
 *      description: object for updating mood
 *      required: true
 *      schema:
 *       $ref: '#/definitions/updateMood'
 *   responses:
 *     200:
 *      description: edit User Mood
 * 
 *  delete:
 *   tags:
 *    - Access Management
 *   description: API delete mood
 *   operationId: deleteMood     
 *   parameters:
 *    - in: path
 *      name: userId
 *      description: "User Id"
 *      required: true
 *      type: string
 *      exmaple: "5e70cf17d67dff48877c1136"
 *    - in: body
 *      name: data
 *      description: object for updating mood
 *      required: true
 *      schema:
 *       $ref: '#/definitions/deleteMood'
 *   responses:
 *     200:
 *      description: edit User Mood
 * 
 * /profile/{userId}:
 *  get:
 *   tags:
 *    - Access Management
 *   description: API for get my Profile
 *   operationId: getMyProfile     
 *   parameters:
 *    - in: path
 *      name: userId
 *      description: "User Id"
 *      required: true
 *      type: string
 *      exmaple: "5e70cf17d67dff48877c1136"
 *   responses:
 *     200:
 *      description: User profile
 * 
 * /my-profile/{userId}:
 *  put:
 *   tags:
 *    - Access Management
 *   description: API for update my Profile
 *   operationId: setMyProfile     
 *   parameters:
 *    - in: path
 *      name: userId
 *      description: "User Id"
 *      required: true
 *      type: string
 *      exmaple: "5e70cf17d67dff48877c1136"
 *    - in: body
 *      name: data
 *      description: object for updating user
 *      required: true
 *      schema:
 *       $ref: '#/definitions/updateUser'
 *   responses:
 *     200:
 *      description: User profile
 * 
 * /login:
 *  post:
 *   tags:
 *    - Access Management
 *   description: Login API
 *   operationId: login     
 *   parameters:
 *    - in: body
 *      name: data
 *      description: object for validating user in Login
 *      required: true
 *      schema:
 *       $ref: '#/definitions/login'
 *   responses:
 *     200:
 *      description: LogedIn
 * 
 * /settings/{userId}:
 *  get:
 *   tags:
 *    - Access Management
 *   description: API for get my App settings
 *   operationId: getMySettings     
 *   parameters:
 *    - in: path
 *      name: userId
 *      description: "User Id"
 *      required: true
 *      type: string
 *      exmaple: "5e70cf17d67dff48877c1136"
 *   responses:
 *     200:
 *      description: My settings
 * 
 *  put:
 *   tags:
 *    - Access Management
 *   description: API for update my App settings
 *   operationId: updateMySettings     
 *   parameters:
 *    - in: path
 *      name: userId
 *      description: "User Id"
 *      required: true
 *      type: string
 *      exmaple: "5e70cf17d67dff48877c1136"
 *    - in: body
 *      name: data
 *      description: object for updating the settings
 *      required: true
 *      schema:
 *       $ref: '#/definitions/settings'
 *   responses:
 *     200:
 *      description: success
 * 
 * /block:
 *  post:
 *   tags:
 *    - Access Management
 *   description: API for block the User
 *   operationId: block     
 *   parameters:
 *    - in: body
 *      name: data
 *      description: "id - loggedIn userID, userId - block userId"
 *      required: true
 *      schema:
 *       $ref: '#/definitions/blockUser'
 *   responses:
 *     200:
 *      description: followed User
 * 
 * /unblock:
 *  post:
 *   tags:
 *    - Access Management
 *   description: API for unblock the User
 *   operationId: unblock     
 *   parameters:
 *    - in: body
 *      name: data
 *      description: "id - loggedIn userID, userId - unblock userId"
 *      required: true
 *      schema:
 *       $ref: '#/definitions/blockUser'
 *   responses:
 *     200:
 *      description: Unfollowed User
 * 
 * /check-username/{username}:
 *  get:
 *   tags:
 *    - Access Management
 *   description: API for get the already taken Username
 *   operationId: searchUsername     
 *   parameters:
 *    - in: path
 *      name: username
 *      description: "username"
 *      required: true
 *      type: string
 *      exmaple: "pupinder"
 *   responses:
 *     200:
 *      description: alreday taken
 * 
 * /follower-list/{userId}:
 *  get:
 *   tags:
 *    - Access Management
 *   description: API for get the list of following and followers.
 *   operationId: followFollowingList     
 *   parameters:
 *    - in: path
 *      name: userId
 *      description: "userId"
 *      required: true
 *      type: string
 *      exmaple: "5e70cfddd67dff48877c116d"
 *   responses:
 *     200:
 *      description: list of the followers
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * definitions:
 *  updateMood:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *        example: "2020-07-01"
 *      moodTime:
 *        type: string
 *        example: "14:55:58"
 *      mood:
 *        type: string
 *        example: "mood text"
 *      desc:
 *        type: string
 *        example: "mood desc"
 *  deleteMood:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *        example: "2020-07-01"
 *      moodTime:
 *        type: string
 *        example: "14:55:58"
 *  followUser:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *        example: "5e70cf17d67dff48877c1136"
 *      userId:
 *        type: string
 *        example: "5e70cfddd67dff48877c116d"
 * 
 *  blockUser:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *        example: "5e70cf17d67dff48877c1136"
 *      userId:
 *        type: string
 *        example: "5e70cfddd67dff48877c116d"
 * 
 *  mood:
 *    type: object
 *    properties:
 *      userId:
 *        type: string
 *        example: "5e70cf17d67dff48877c1136"
 *      mood:
 *        type: string
 *        example: "Happy"
 *      description:
 *        type: string
 *        example: "I am happy today"
 *      moodDate:
 *        type: string
 *        example: "2019-08-30"
 *      moodTime:
 *        type: string
 *        example: "21:08:01"
 * 
 *  settings:
 *    type: object
 *    properties:
 *      emailNotification:
 *        type: boolen
 *        example: true
 *      marketEmailNotification:
 *        type: boolen
 *        example: true
 * 
 *  login:
 *    type: object
 *    properties:
 *      firebaseUID:
 *        type: string
 *        example: "wdsHDSA&575DSA"
 *      email:
 *        type: string
 *        example: "pathaniarajput92@gmail.com"
 *      firstName:
 *        type: string
 *        example: "Pupinder"
 *      lastName:
 *        type: string
 *        example: "Pupinder"
 *      isVerified:
 *        type: boolen
 *        example: true
 *      phoneNumber:
 *        type: string
 *        example: "8054348431"
 *      country:
 *        type: string
 *        example: "India"
 *      lastSignIn:
 *        type: string
 *        example: "2020-04-28 14:12:00"
 *      createdAt:
 *        type: string
 *        example: "2020-04-28 14:12:00"
 *      location:
 *        type: array
 *        example: [-3.56432434, 0.21932]
 *      googleId:
 *        type: string
 *        example: "googleId"
 *      googleEmail:
 *        type: string
 *        example: "googleEmail"
 *      googleDisplayName:
 *        type: string
 *        example: "googleDisplayName"
 *      googlePhotoUrl:
 *        type: string
 *        example: "googlePhotoUrl"
 *      facebookId:
 *        type: string
 *        example: "facebookId"
 *      facebookEmail:
 *        type: string
 *        example: "facebookEmail"
 *      facebookDisplayName:
 *        type: string
 *        example: "facebookDisplayName"
 *      facebookPhotoUrl:
 *        type: string
 *        example: "facebookPhotoUrl"
 *      appleId:
 *        type: string
 *        example: "appleId"
 *      appleEmail:
 *        type: string
 *        example: "appleEmail"
 *      appleDisplayName:
 *        type: string
 *        example: "appleDisplayName"
 *      applePhotoUrl:
 *        type: string
 *        example: "applePhotoUrl"
 *      intro:
 *        type: string
 *        example: "this is my intro"
 *      interest:
 *        type: array
 *        example: ['boxing','chess']
 * 
 *  updateUser:
 *    type: object
 *    properties:
 *      firstName:
 *        type: string
 *        example: "Ram"
 *      lastName:
 *        type: string
 *        example: "Kumar"
 *      photoUrl:
 *        type: string
 *        example: "Upload Image"
 *      coverPhotoUrl:
 *        type: string
 *        example: "Upload Image"
 *      age:
 *        type: string
 *        example: "14"
 *      bio:
 *        type: string
 *        example: "this is bio"
 *      email:
 *        type: string
 *        example: "email@gmail.com"
 *      phoneNumber:
 *        type: string
 *        example: "8054348431"
 *      gender:
 *        type: string
 *        example: "male"
 *      guruzziId:
 *        type: string
 *        example: "ramkumar86"
 *      youTubeLink:
 *        type: string
 *        example: "https://www.youtube.com/channel/UCnpm9u9Ec69OIwn5rbRxe7Q?view_as=subscriber"
 *      instagramLink:
 *        type: string
 *        example: "https://www.instagram.com/who_is_pupinder/"    
 *      intro:
 *         type: string
 *         example: 'This is my intro'
 *      interest:
 *        type: array
 *        example: ['boxing','chess']     
 *         
 * 
 * */
//-------common----------------

router.use(require('./product-route'));
router.use(require('./customer-route'));
router.use(require('./employee-route'));
router.use(require('./login-route'));
router.use(require('./dashboard-route'));
router.use(require('./center-route'));
router.use(require('./color-route'));
router.use(require('./payment-mode-route'));
router.use(require('./expensive-route'));
router.use(require('./feed-entry-route'));
router.use(require('./payment-entry-route'));
router.use(require('./new-payment-entry-route'));
router.use(require('./payment-history-route'));
router.use(require('./purchase-route'));
router.use(require('./shift-route'));
router.use(require('./supplier-route'));
router.use(require('./advance-route'));
router.use(require('./entry-route'));
router.use(require('./entry-details-route'));
router.use(require('./stock-hub-route'));
router.use(require('./stock-details-route'));
router.use(require('./stock-transfer-history-route'));
router.use(require('./commission-settings-route'));
router.use(require('./commission-type-route'));
router.use(require('./salary-route'));
router.use(require('./transport-settings-route'));
router.use(require('./transport-driver-route'));
router.use(require('./transport-entry-route'));
router.use(require('./tanker-supplier-route'));
router.use(require('./tanker-entry-route'));
router.use(require('./customer-advance-route'));
router.use(require('./customer-advance-history-route'));
router.use(require('./customer-salary-route'));
router.use(require('./user-route'));
router.use(require('./pages-route'));
router.use(require('./role-route'));
router.use(require('./role-permission-route'));
 
module.exports = router;
