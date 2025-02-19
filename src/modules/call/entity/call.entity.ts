import { Entity, Column } from 'typeorm';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';
import { IsObject } from 'class-validator';

@Entity(Resources.VSM_Calls, { database: 'voice', engine: 'voice' })
export class Call extends Base {
  @Column()
  refCallId = '';
  // fromNumber
  @Column()
  fromNumber = '';
  // fromSIPAccountId
  @Column()
  fromSIPAccountId = '';
  // fromGateway
  @Column()
  fromGateway = {};
  // toNumber
  @Column()
  toNumber = '';
  // toSIPAccountId
  @Column()
  toSIPAccountId = '';
  // toGateway
  @Column()
  toGateway = {};
  // toUserId
  @Column()
  toUserId = '';
  // fromUserId
  @Column()
  fromUserId = '';
  // callId
  @Column()
  callId = '';
  // cdrId
  @Column()
  cdrId = '';
  // dialplanId
  @Column()
  dialplanId = '';
  // queueId
  @Column()
  queueId = '';
  // campaignId
  @Column()
  campaignId = '';
  // campaignContactId
  @Column()
  campaignContactId = '';
  // contactId
  @Column()
  contactId = '';
  // direction
  @Column()
  direction = '';
  // result
  @Column()
  result = '';
  // note
  @Column()
  note?: string = '';
  // data
  @Column({ default: {} })
  @IsObject()
  data: any;
  // startedAt
  @Column() startedAt?: Date;
  // answeredAt
  @Column() answeredAt?: Date;
  // endedAt
  @Column() endedAt?: Date;
  // duration
  @Column({ default: 0 }) duration: number;
  // answeredDuration
  @Column({ default: 0 }) answeredDuration: number;
  // recordingFile
  @Column()
  recordingFile = '';
  @Column()
  transfererNumber = '';
  @Column()
  transfereeNumber = '';
  @Column()
  menu = '';
}
