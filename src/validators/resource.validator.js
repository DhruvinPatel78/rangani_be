const { body } = require('express-validator');

const memberValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('surname').optional({ nullable: true }).isString().trim(),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Invalid email'),
  body('phone').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('gender')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['male', 'female'])
    .withMessage('Invalid gender'),
  body('maritalStatus')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['single', 'engaged', 'married', 'widow'])
    .withMessage('Invalid marital status'),
  body('occupation')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['child', 'study', 'self_employed', 'service', 'retired', 'homemaker'])
    .withMessage('Invalid occupation'),
  body('dateOfBirth').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid date of birth'),
  body('isAlive').optional().isBoolean().withMessage('isAlive must be boolean'),
  body('dateOfDeath').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid date of death'),
  body('family').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid family id'),
  body('familyName').optional({ nullable: true }).isString().trim(),
  body('father').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid father id'),
  body('fatherName').optional({ nullable: true }).isString().trim(),
  body('mother').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid mother id'),
  body('motherName').optional({ nullable: true }).isString().trim(),
  body('spouse').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid spouse id'),
  body('spouseName').optional({ nullable: true }).isString().trim(),
  body('city').optional({ nullable: true }).isString().trim(),
  body('native').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid native id'),
  body('occupation').optional({ nullable: true }).isString().trim(),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

const familyValidators = [
  body('name').trim().notEmpty().withMessage('Family name is required'),
  body('headName').trim().notEmpty().withMessage('Head name is required'),
  body('memberCount').optional().isInt({ min: 0 }).withMessage('memberCount must be >= 0'),
  body('city').optional({ nullable: true }).isString().trim(),
  body('address').optional({ nullable: true }).isString().trim(),
  body('countryName').optional({ nullable: true }).isString().trim(),
  body('stateName').optional({ nullable: true }).isString().trim(),
  body('districtName').optional({ nullable: true }).isString().trim(),
  body('country').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid country id'),
  body('state').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid state id'),
  body('district').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid district id'),
  body('cityRef').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid city id'),
  body('parentFamily').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid parent family id'),
  body('associatedFirms')
    .optional({ nullable: true })
    .isArray()
    .withMessage('associatedFirms must be an array'),
  body('associatedFirms.*').optional().isMongoId().withMessage('Invalid firm id'),
  body('native').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid native id'),
];

const firmValidators = [
  body('name').trim().notEmpty().withMessage('Firm name is required'),
  body('ownerName').optional({ nullable: true }).isString().trim(),
  body('businessType').optional({ nullable: true }).isString().trim(),
  body('category').optional({ nullable: true }).isString().trim(),
  body('address').optional({ nullable: true }).isString().trim(),
  body('contactNumber1').optional({ nullable: true }).isString().trim(),
  body('contactNumber2').optional({ nullable: true }).isString().trim(),
  body('city').optional({ nullable: true }).isString().trim(),
  body('countryName').optional({ nullable: true }).isString().trim(),
  body('stateName').optional({ nullable: true }).isString().trim(),
  body('districtName').optional({ nullable: true }).isString().trim(),
  body('phone').optional({ nullable: true }).isString().trim(),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Invalid email'),
  body('country').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid country id'),
  body('state').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid state id'),
  body('district').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid district id'),
  body('cityRef').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid city id'),
  body('family').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('Invalid family id'),
];

const countryValidators = [
  body('name').trim().notEmpty().withMessage('Country name is required'),
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Country code is required')
    .isLength({ min: 2, max: 3 })
    .withMessage('Country code must be 2-3 characters'),
  body('isActive').optional().isBoolean(),
];

const stateValidators = [
  body('name').trim().notEmpty().withMessage('State name is required'),
  body('country').isMongoId().withMessage('Valid country id is required'),
  body('isActive').optional().isBoolean(),
];

const districtValidators = [
  body('name').trim().notEmpty().withMessage('District name is required'),
  body('state').isMongoId().withMessage('Valid state id is required'),
  body('isActive').optional().isBoolean(),
];

const cityValidators = [
  body('name').trim().notEmpty().withMessage('City name is required'),
  body('district').isMongoId().withMessage('Valid district id is required'),
  body('isActive').optional().isBoolean(),
];

const nativeValidators = [
  body('name').trim().notEmpty().withMessage('Native name is required').isLength({ min: 2, max: 100 }),
];

const businessTypeValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Business type name is required')
    .isLength({ min: 2, max: 100 }),
];

const surnameValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Surname is required')
    .isLength({ min: 2, max: 100 }),
];

const managerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit phone is required'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('assignedRegion').optional({ nullable: true }).isString().trim(),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
];

const createManagerValidators = [
  ...managerValidators,
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }),
];

const createFamilyFromMemberValidators = [
  body('headMember').isMongoId().withMessage('Valid head member id is required'),
  ...familyValidators,
];

module.exports = {
  memberValidators,
  familyValidators,
  createFamilyFromMemberValidators,
  firmValidators,
  countryValidators,
  stateValidators,
  districtValidators,
  cityValidators,
  nativeValidators,
  businessTypeValidators,
  surnameValidators,
  managerValidators,
  createManagerValidators,
};
