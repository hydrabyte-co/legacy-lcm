import {
  ActivityTypeCode,
  InvestigationTypeCode,
  RelationCode,
} from 'src/modules/activity/enum/activity.enum';
import { Services } from '../common/enums/services';
export const serviceInfo = {
  name: Services.LCM,
};

export const activityTypes = [
  {
    code: ActivityTypeCode.Call,
    name: 'Gọi điện',
    tags: ['call', 'gọi', 'đt', 'điện thoại'],
  },
  {
    code: ActivityTypeCode.SMS,
    name: 'Gửi SMS',
    tags: ['sms'],
  },
  {
    code: ActivityTypeCode.Email,
    name: 'Gửi Email',
    tags: ['email'],
  },
  {
    code: ActivityTypeCode.Letter,
    name: 'Gửi thư',
    tags: ['letter'],
  },
  {
    code: ActivityTypeCode.Visit,
    name: 'Đi địa bàn',
    tags: ['visit'],
  },
  {
    code: ActivityTypeCode.Chat,
    name: 'Chat',
    tags: ['chat'],
  },
  {
    code: ActivityTypeCode.Skip,
    name: 'Điều tra',
    tags: ['skip'],
  },
];

export const relations = [
  {
    name: 'Bố mẹ',
    code: RelationCode.Parent,
    tags: ['bố mẹ', 'bố', 'mẹ', 'me', 'bo', 'bố/mẹ', 'cha'],
  },
  {
    name: 'Vợ chồng',
    code: RelationCode.Spouse,
    tags: ['vợ chồng', 'vợ', 'chồng', 'vợ/chồng', 'vo chong'],
  },
  {
    name: 'Anh chị em',
    code: RelationCode.Sibling,
    tags: ['anh chị em', 'anh', 'chị', 'em'],
  },
  {
    name: 'Con cái',
    code: RelationCode.Child,
    tags: ['con', 'con trai', 'con gái', 'con cái', 'con cai'],
  },
  {
    name: 'Bạn bè',
    code: RelationCode.Friend,
    tags: ['bạn', 'bạn bè', 'ban be'],
  },
  {
    name: 'Người thân khác',
    code: RelationCode.OtherRelative,
    tags: [
      'cô',
      'chú',
      'bác',
      'cháu',
      'ông',
      'bà',
      'anh re',
      'anh rể',
      'chị họ',
      'chi ho',
      'người thân',
      'nguoi than',
      'cháu',
      'chau',
    ],
  },
  {
    name: 'Đồng nghiệp',
    code: RelationCode.Colleague,
    tags: ['đồng nghiệp', 'công ty', 'colleague', 'dong nghiep', 'dn'],
  },
  {
    name: 'Khách hàng',
    code: RelationCode.Client,
    tags: ['client', 'kh', 'khách hàng', 'customer'],
  },
  {
    name: 'Khác',
    code: RelationCode.Other,
    tags: [''],
  },
];

export const investigationTypes: {
  name: string;
  code: string;
  tags: string[];
}[] = [
  {
    name: 'Địa chỉ',
    code: InvestigationTypeCode.Address,
    tags: ['địa chỉ', 'address'],
  },
  {
    name: 'Email',
    code: InvestigationTypeCode.Email,
    tags: ['email'],
  },
  {
    name: 'Mạng xã hội',
    code: InvestigationTypeCode.SocialNetwork,
    tags: [
      'mxh',
      'facebook',
      'mạng xã hội',
      'twitter',
      'zalo',
      'social-network',
    ],
  },
  {
    name: 'Số điện thoại',
    code: InvestigationTypeCode.PhoneNumber,
    tags: ['điện thoại', 'di dộng', 'số điện thoại', 'phone-number'],
  },
  {
    name: 'Thông tin khác',
    code: InvestigationTypeCode.Other,
    tags: ['thông tin khác', 'other'],
  },
];
