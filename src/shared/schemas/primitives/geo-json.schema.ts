/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 14:15:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 02:08:52
 * @FilePath      : /server/src/shared/schemas/primitives/geo-json.schema.ts
 * @Description   : Geographic and location-related schema validations
 */

import { z } from 'zod'

// ===========================
// COORDINATE VALIDATION
// ===========================
export const LongitudeSchema = z.number().min(-180).max(180)

export const LatitudeSchema = z.number().min(-90).max(90)

export const CoordinatesSchema = z.tuple([
  LongitudeSchema, // Longitude first (GeoJSON standard)
  LatitudeSchema,  // Latitude second
])

// ===========================
// GEOJSON SCHEMAS
// ===========================
export const GeoPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: CoordinatesSchema,
})

export const OptionalGeoPointSchema = GeoPointSchema.optional()

export const NullableGeoPointSchema = GeoPointSchema.nullable()

export const OptionalNullableGeoPointSchema = GeoPointSchema.nullable().optional()

// ===========================
// GEOJSON POLYGON: Collection of Coordinates (Make a closed ring)
// ===========================
export const PolygonCoordinatesSchema = z.array(z.array(CoordinatesSchema).min(4).max(1000)).refine(
  (coords) => {
    if (coords.length === 0) return false
    const firstRing = coords[0]
    if (firstRing.length < 4) return false
    const firstPoint = firstRing[0]
    const lastPoint = firstRing[firstRing.length - 1]
    return firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1]
  },
  { message: 'Polygon must form a closed ring with at least 4 points' }
)

export const GeoPolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: PolygonCoordinatesSchema,
})

// ===========================
// GEOJSON MULTIPOINT: Collection of Point
// ===========================
export const MultiPointCoordinatesSchema = z.array(CoordinatesSchema)

export const GeoMultiPointSchema = z.object({
  type: z.literal('MultiPoint'),
  coordinates: MultiPointCoordinatesSchema,
})

// ===========================
// LOCATION TEXT FIELDS
// ===========================
export const LocationNameSchema = z.string().trim().max(200)

export const AddressSchema = z.string().trim().max(500)

export const CitySchema = z.string().trim().max(100)

export const StateSchema = z.string().trim().max(100)

export const CountrySchema = z.string().trim().max(100)

export const CountryCodeSchema = z.string()
  .trim()
  .length(2)
  .toUpperCase()
  .regex(/^[A-Z]{2}$/)

export const PostalCodeSchema = z.string().trim().max(20)

export const TimezoneSchema = z.string()
  .trim()
  .max(50)
  .regex(/^[A-Za-z]+(?:_[A-Za-z]+)*\/[A-Za-z]+(?:_[A-Za-z]+)*$/) // e.g., Asia/Ho_Chi_Minh (Continent/City format)
  
// ===========================
// GEOGRAPHIC MEASUREMENTS
// ===========================
export const AccuracySchema = z.number().min(0).max(1000) // meters

export const AltitudeSchema = z.number() // meters above sea level

export const BearingSchema = z.number().min(0).max(360) // degrees

export const SpeedSchema = z.number().min(0) // m/s

// ===========================
// COMPLETE ADDRESS SCHEMA
// ===========================
export const AddressObjectSchema = z.object({
  street: AddressSchema.optional(),
  city: CitySchema.optional(),
  state: StateSchema.optional(),
  country: CountrySchema.optional(),
  countryCode: CountryCodeSchema.optional(),
  postalCode: PostalCodeSchema.optional(),
  formatted: AddressSchema.optional(),
})

// ===========================
// LOCATION WITH METADATA
// ===========================
export const LocationWithMetaSchema = z.object({
  point: GeoPointSchema,
  name: LocationNameSchema.optional(),
  address: AddressObjectSchema.optional(),
  timezone: TimezoneSchema.optional(),
  accuracy: AccuracySchema.optional(),
  altitude: AltitudeSchema.optional(),
  bearing: BearingSchema.optional(),
  speed: SpeedSchema.optional(),
})

// ===========================
// DISTANCE & BOUNDS
// ===========================
export const DistanceSchema = z.number().min(0) // meters

export const RadiusSchema = z.number().min(0).max(40075000) // max Earth circumference in meters

export const BoundingBoxSchema = z.object({
  southwest: CoordinatesSchema,
  northeast: CoordinatesSchema,
})

// ===========================
// GEO QUERY SCHEMAS
// ===========================
export const GeoNearQuerySchema = z.object({
  center: GeoPointSchema,
  radius: RadiusSchema,
  unit: z.enum(['m', 'km', 'mi', 'ft']).default('m'),
})

export const GeoWithinQuerySchema = z.object({
  geometry: z.union([GeoPointSchema, GeoPolygonSchema]),
})

export const LocationStringSchema = z.string().trim().max(200)

// ===========================
// TYPE EXPORTS
// ===========================
export type CoordinatesType = z.infer<typeof CoordinatesSchema>
export type GeoPointType = z.infer<typeof GeoPointSchema>
export type AddressObjectType = z.infer<typeof AddressObjectSchema>
export type LocationWithMetaType = z.infer<typeof LocationWithMetaSchema>
export type BoundingBoxType = z.infer<typeof BoundingBoxSchema>
export type GeoNearQueryType = z.infer<typeof GeoNearQuerySchema>
export type LocationStringType = z.infer<typeof LocationStringSchema>
