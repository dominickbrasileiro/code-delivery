import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RouteDocument = Route & Document;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Route {
  id: string;

  @Prop()
  _id: string;

  @Prop()
  title: string;

  @Prop(
    raw({
      lat: { type: Number },
      long: { type: Number },
    }),
  )
  startPosition: { lat: number; long: number };

  @Prop(
    raw({
      lat: { type: Number },
      long: { type: Number },
    }),
  )
  endPosition: { lat: number; long: number };
}

export const RouteSchema = SchemaFactory.createForClass(Route);
