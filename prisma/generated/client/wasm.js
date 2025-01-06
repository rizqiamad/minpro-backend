
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.0.0
 * Query Engine version: 5dbef10bdbfb579e07d35cc85fb1518d357cb99e
 */
Prisma.prismaVersion = {
  client: "6.0.0",
  engine: "5dbef10bdbfb579e07d35cc85fb1518d357cb99e"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CityScalarFieldEnum = {
  id: 'id',
  city: 'city'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  name_place: 'name_place',
  address: 'address',
  city_id: 'city_id'
};

exports.Prisma.OrganizerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  avatar: 'avatar',
  no_handphone: 'no_handphone',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  full_name: 'full_name',
  email: 'email',
  password: 'password',
  avatar: 'avatar',
  no_handphone: 'no_handphone',
  dob: 'dob',
  jenis_kelamin: 'jenis_kelamin',
  isVerified: 'isVerified',
  ref_code: 'ref_code',
  refer_by: 'refer_by',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketScalarFieldEnum = {
  id: 'id',
  event_id: 'event_id',
  name: 'name',
  start_date: 'start_date',
  end_date: 'end_date',
  price: 'price',
  seats: 'seats',
  description: 'description'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  base_price: 'base_price',
  coupon: 'coupon',
  point: 'point',
  final_price: 'final_price',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.TicketTransactionScalarFieldEnum = {
  transaction_id: 'transaction_id',
  ticket_id: 'ticket_id',
  quantity: 'quantity',
  subtotal: 'subtotal'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  active: 'active',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.PointScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  total: 'total',
  active: 'active',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  name: 'name',
  image: 'image',
  start_date: 'start_date',
  end_date: 'end_date',
  start_time: 'start_time',
  end_time: 'end_time',
  location_id: 'location_id',
  organizer_id: 'organizer_id',
  category: 'category',
  type: 'type',
  description: 'description',
  terms_condition: 'terms_condition',
  coupon_seat: 'coupon_seat'
};

exports.Prisma.ReviewScalarFieldEnum = {
  user_id: 'user_id',
  event_id: 'event_id',
  comment: 'comment',
  rating: 'rating',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.JenisKelamin = exports.$Enums.JenisKelamin = {
  l: 'l',
  p: 'p'
};

exports.StatusTransaction = exports.$Enums.StatusTransaction = {
  pending: 'pending',
  success: 'success',
  canceled: 'canceled'
};

exports.EventCategory = exports.$Enums.EventCategory = {
  Festival: 'Festival',
  Konser: 'Konser',
  Pertandingan: 'Pertandingan',
  Workshop: 'Workshop',
  Konferensi: 'Konferensi',
  Seminar: 'Seminar',
  Pertunjukkan: 'Pertunjukkan',
  Lainnya: 'Lainnya'
};

exports.EventType = exports.$Enums.EventType = {
  free: 'free',
  paid: 'paid'
};

exports.Prisma.ModelName = {
  City: 'City',
  Location: 'Location',
  Organizer: 'Organizer',
  User: 'User',
  Ticket: 'Ticket',
  Transaction: 'Transaction',
  TicketTransaction: 'TicketTransaction',
  Coupon: 'Coupon',
  Point: 'Point',
  Event: 'Event',
  Review: 'Review'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
