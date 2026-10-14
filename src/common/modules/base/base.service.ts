import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { getTypeOf } from 'src/common/utils/object-helper';
import { MongoRepository, FindManyOptions } from 'typeorm';
import { Filter } from './constant/base.const';
import { FindManyFilter, FindAllResult } from './dto/find-many.dto';
import { DataHandler } from './entity/data.class';
import { logInfo } from 'src/common/utils/log-helper';
import { DeleteOneResult } from 'src/common/types/controller-dto';

//
export interface ObjectLiteral {
  [key: string]: any;
}

@Injectable()
export class BaseService<T> {
  private _repo: MongoRepository<T>;
  constructor(repo) {
    this._repo = repo;
  }
  async findOne(id: string, handler: DataHandler): Promise<T | null> {
    if (handler)
      if (ObjectId.isValid(id)) {
        const where = {
          _id: ObjectId.createFromHexString(id),
        };
        if (handler.permission) {
          if (handler.permission.conditions) {
            if (handler.permission.conditions['owner.orgId'] === '{{orgId}}') {
              where['owner.orgId'] = handler.orgId;
            } else if (handler.permission.conditions['owner.orgId']) {
              where['owner.orgId'] =
                handler.permission.conditions['owner.orgId'];
            }
            if (
              handler.permission.conditions['owner.userId'] === '{{userId}}'
            ) {
              where['owner.userId'] = handler.userId;
            } else if (handler.permission.conditions['owner.userId']) {
              where['owner.userId'] =
                handler.permission.conditions['owner.userId'];
            }
          }
        }
        logInfo('*', 'base.service.findOne -> where', where);
        const item: any = await this._repo.findOneBy(where);
        if (item === undefined || item === null || item.isDeleted === true) {
          throw new NotFoundException(`Resource id '${id}' not found!`);
        }
        // Handle check owner by permission
        if (handler.permission) {
        }
        // TODO: remove this check owner logic if all Services Permission is updated
        else {
          if (typeof handler.request.where === 'object') {
            let isOwner = true;
            if (handler.request.where.orgId === '{{orgId}}') {
              isOwner =
                item.owner !== undefined && item.owner.orgId === handler.orgId;
            }
            // TODO: fix this check user owner
            /* if (handler.request.owner.userId === '{{userId}}') {
              isOwner =
                item.owner !== undefined &&
                (item.owner.userId === handler.userId ||
                  item.owner.userId === '');
            } */
            if (!isOwner) {
              throw new ForbiddenException(
                `You are not allow to access this resource id '${id}'`,
              );
            }
          }
        }

        // Handle response transform by permission
        if (typeof handler.response === 'object') {
          for (const key in handler.response) {
            if (handler.response[key] === null) {
              delete item[key];
            }
          }
        }
        return item;
      } else {
        throw new NotFoundException(`Invalid id '${id}'`);
      }
  }

  async findOne_old(id: string, handler: DataHandler): Promise<T | null> {
    if (handler)
      if (ObjectId.isValid(id)) {
        const item: any = await this._repo.findOneBy({
          _id: ObjectId.createFromHexString(id),
        });
        if (item === undefined || item === null || item.isDeleted === true) {
          throw new NotFoundException(`Resource id '${id}' not found!`);
        }
        // Handle check owner by permission
        if (handler.permission) {
          if (handler.permission.conditions) {
            let isOwner = true;
            if (handler.permission.conditions.orgId === '{{orgId}}') {
              isOwner =
                item.owner !== undefined && item.owner.orgId === handler.orgId;
            }
            if (handler.permission.conditions.userId === '{{userId}}') {
              isOwner =
                item.owner !== undefined &&
                item.owner.userId === handler.userId;
            }
            if (!isOwner) {
              throw new ForbiddenException(
                `You are not allow to access this resource id '${id}'`,
              );
            }
          }
        }
        // TODO: remove this check owner logic if all Services Permission is updated
        else {
          if (typeof handler.request.where === 'object') {
            let isOwner = true;
            if (handler.request.where.orgId === '{{orgId}}') {
              isOwner =
                item.owner !== undefined && item.owner.orgId === handler.orgId;
            }
            // TODO: fix this check user owner
            /* if (handler.request.owner.userId === '{{userId}}') {
              isOwner =
                item.owner !== undefined &&
                (item.owner.userId === handler.userId ||
                  item.owner.userId === '');
            } */
            if (!isOwner) {
              throw new ForbiddenException(
                `You are not allow to access this resource id '${id}'`,
              );
            }
          }
        }

        // Handle response transform by permission
        if (typeof handler.response === 'object') {
          for (const key in handler.response) {
            if (handler.response[key] === null) {
              delete item[key];
            }
          }
        }
        return item;
      } else {
        throw new NotFoundException(`Invalid id '${id}'`);
      }
  }

  async findOneByField(
    field: string,
    value: string,
    handler: DataHandler,
  ): Promise<any> {
    if (handler) {
      const item: any = await this._repo.findOneBy({ [field]: value });
      if (item === undefined || item.isDeleted === true) {
        throw new NotFoundException(
          `Resource with ${field} = '${value}' not found!`,
        );
      }
      // Handle check owner by permission
      if (handler.permission) {
        if (handler.permission.conditions) {
          let isOwner = true;
          if (handler.permission.conditions.orgId === '{{orgId}}') {
            isOwner =
              item.owner !== undefined && item.owner.orgId === handler.orgId;
          }
          if (handler.permission.conditions.userId === '{{userId}}') {
            isOwner =
              item.owner !== undefined && item.owner.userId === handler.userId;
          }
          if (!isOwner) {
            throw new ForbiddenException(
              `You are not allow to access this resource '${item.id}'`,
            );
          }
        }
      }
      // TODO: remove this check owner logic if all Services Permission is updated
      else {
        if (typeof handler.request === 'object') {
          if (typeof handler.request.owner === 'object') {
            let isOwner = true;
            if (handler.request.owner.orgId === '{{orgId}}') {
              isOwner =
                item.owner !== undefined && item.owner.orgId === handler.orgId;
            }
            if (handler.request.owner.userId === '{{userId}}') {
              isOwner =
                item.owner !== undefined &&
                item.owner.userId === handler.userId;
            }
            if (!isOwner) {
              throw new ForbiddenException(
                `You are not allow to access this resource with ${field} = '${value}'`,
              );
            }
          }
        }
      }
      // Handle response transform by permission
      if (typeof handler.response === 'object') {
        for (const key in handler.response) {
          if (handler.response[key] === null) {
            delete item[key];
          }
        }
      }
      return item;
    }
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<T>> {
    const findManyOptions: FindManyOptions = {
      where: { isDeleted: { $in: [false, null] } },
      order: {},
      take: 0,
      skip: 0,
    };
    const findManyResult = new FindAllResult<T>();
    logInfo('*', 'base.service.findManyWithPaging -> filter', filter);
    if (filter.where) {
      delete (filter.where as any).isDeleted;
      for (const key in filter.where) {
        const params: string[] = key.split(':');
        let operator = '$eq';
        let field = key;
        if (params[params.length - 1].indexOf('$') === 0) {
          operator = params[params.length - 1].toLowerCase();
          field = key.replace(`:${operator}`, '');
        }
        if (Object.prototype.hasOwnProperty.call(filter.where, key)) {
          const value = filter.where[key];
          if (value !== '') {
            switch (operator) {
              case '$regex': {
                findManyOptions.where[field] = new RegExp(value, 'i');
                break;
              }
              case '$gte':
              case '$gt':
              case '$lte':
              case '$lt':
              case '$in': {
                let arr = [];
                if (Array.isArray(value)) {
                  arr = value;
                } else if (typeof value === 'string') {
                  arr = value.split(',').map((item) => item.trim());
                } else {
                  arr = [value];
                }
                findManyOptions.where[field] = {
                  [operator]: arr,
                };
                break;
              }
              case '$eq':
              default: {
                findManyOptions.where[field] = value;
                break;
              }
            }
          }
        }
      }
    }
    if (filter.order) {
      findManyOptions.order = filter.order;
    }

    // Handle filter by permission
    if (handler.permission) {
      if (handler.permission.conditions) {
        if (handler.permission.conditions['owner.orgId'] === '{{orgId}}') {
          findManyOptions.where['owner.orgId'] = handler.orgId;
        } else if (handler.permission.conditions['owner.orgId']) {
          findManyOptions.where['owner.orgId'] =
            handler.permission.conditions['owner.orgId'];
        }
        if (handler.permission.conditions['owner.userId'] === '{{userId}}') {
          findManyOptions.where['owner.userId'] = handler.userId;
        } else if (handler.permission.conditions['owner.userId']) {
          findManyOptions.where['owner.userId'] =
            handler.permission.conditions['owner.userId'];
        }
      }
    } else if (handler.request) {
      if (typeof handler.request.where === 'object') {
        for (const key in handler.request.where) {
          if (
            Object.prototype.hasOwnProperty.call(handler.request.where, key)
          ) {
            const value = handler.request.where[key];
            const dataType = getTypeOf(value);
            const varRegex = /{{(userId|appId|orgId)}}/;
            const replaceVar = (str, handler) =>
              str
                .replace('{{orgId}}', handler.orgId)
                .replace('{{appId}}', handler.appId)
                .replace('{{userId}}', handler.userId);
            switch (dataType) {
              case 'object':
              case 'array': {
                const valueString = JSON.stringify(value);
                if (varRegex.test(valueString)) {
                  findManyOptions.where[key] = JSON.parse(
                    replaceVar(valueString, handler),
                  );
                } else {
                  findManyOptions.where[key] = value;
                }
                break;
              }
              case 'string': {
                if (varRegex.test(value)) {
                  findManyOptions.where[key] = replaceVar(value, handler);
                } else {
                  findManyOptions.where[key] = value;
                }
                break;
              }
              default: {
                findManyOptions.where[key] = value;
                break;
              }
            }
          }
        }
      }
    }
    
    // Ensure paging object exists and has valid values
    if (!filter.paging) {
      filter.paging = {
        index: Filter.PageIndex,
        size: Filter.PageSize,
      };
    }
    
    if (filter.paging.index < 0) {
      filter.paging.index = Filter.PageIndex;
    }
    if (filter.paging.size <= 0 || filter.paging.size > Filter.MaxPageSize) {
      filter.paging.size = Filter.PageSize;
    }
    findManyResult.paging.index = filter.paging.index;
    findManyResult.paging.size = filter.paging.size;
    findManyOptions.take = findManyResult.paging.size;
    findManyOptions.skip =
      findManyResult.paging.index * findManyResult.paging.size;
    findManyResult.paging.totalItems = await this._repo.count(
      findManyOptions.where,
    );
    findManyResult.paging.totalPages = Math.ceil(
      findManyResult.paging.totalItems / findManyResult.paging.size,
    );
    if (filter.select) {
      findManyOptions.select = filter.select;
    }
    if (handler) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      logInfo(
        `*`,
        `baseService.findManyWithPaging -> findManyOptions`,
        findManyOptions,
      );
      const items = await this._repo.find(findManyOptions);
      // Handle response transform by permission
      if (typeof handler.response === 'object') {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          for (const key in handler.response) {
            if (handler.response[key] === null) {
              delete item[key];
            }
          }
        }
      }
      findManyResult.data = items;
    }
    return findManyResult;
  }

  async createOne(data: any, handler: DataHandler): Promise<any> {
    data.createdBy = JSON.parse(JSON.stringify(handler));
    data.createdAt = new Date();
    data.isDeleted = false;

    // Delete roles, request, response, attribute, permission to not store on createdAt
    delete data.createdBy.roles;
    delete data.createdBy.request;
    delete data.createdBy.response;
    delete data.createdBy.accessToken;
    delete data.createdBy.attributes;
    delete data.createdBy.permission;
    delete data.createdBy.staffCode;

    // Set owner default value
    if (data.owner === undefined) {
      data.owner = {
        orgId: '',
        appId: '',
        userId: '',
      };
    }

    if (handler.permission) {
      if (!handler.permission.request) {
        handler.permission.request = {};
      }
      let orgId =
        handler.permission.request['owner.orgId'] ||
        handler.permission.request.owner?.orgId ||
        '';
      let userId =
        handler.permission.request['owner.userId'] ||
        handler.permission.request.owner?.userId ||
        '';
      if (orgId === '{{orgId}}') {
        orgId = handler.orgId;
      }
      if (userId === '{{userId}}') {
        userId = handler.userId;
      }
      if (handler.scope === 'universe') {
        if (!data.owner.orgId) {
          data.owner.orgId = orgId;
        }
      } else {
        data.owner.orgId = orgId;
        data.owner.userId = userId;
      }
    }
    // TODO: Remove this condition if all permission are refactored
    else if (typeof handler.request === 'object') {
      if (typeof handler.request.owner === 'object') {
        if (handler.request.owner.orgId === null) {
          data.owner.orgId = '';
        }
        if (handler.request.owner.userId === null) {
          data.owner.userId = '';
        }
        if (handler.request.owner.orgId === '{{orgId}}') {
          data.owner.orgId = handler.orgId;
        }
        if (handler.request.owner.userId === '{{userId}}') {
          data.owner.userId = handler.userId;
        }
      }
    }
    if (data.owner.orgId === undefined || data.owner.orgId === '') {
      throw new BadRequestException(`Owner of resource is not defined!`);
    }
    logInfo(`*`, `base.service.createOne -> data`, data);

    try {
      const createDataResult = await this._repo.save(data);
      // Handle response transform by permission
      if (typeof handler.response === 'object') {
        for (const key in handler.response) {
          if (handler.response[key] === null) {
            delete createDataResult[key];
          }
        }
      }
      return createDataResult;
    } catch (error) {
      console.log(error.code, error);
      let errorMessage = 'Error in create new data!';
      switch (error.code) {
        case 11000: {
          errorMessage = `Duplicate key`;
          // TODO: Xử lý hiển thị field và value bị duplicate ra message.
          break;
        }
      }
      /* for (const key in error) {
        if (Object.prototype.hasOwnProperty.call(error, key)) {
          const element = error[key];
          console.log(`${key}:`, element);
        }
      } */
      throw new BadRequestException(errorMessage);
    }
  }

  async createMany(data: any[], handler: DataHandler): Promise<any> {
    const createManyResult: {
      successCount: number;
      failureCount: number;
    } = {
      successCount: 0,
      failureCount: 0,
    };
    const items: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      item.createdBy = JSON.parse(JSON.stringify(handler));
      item.createdAt = new Date();
      item.isDeleted = false;

      // Delete roles, request, response to not store on createdAt
      delete item.createdBy.roles;
      delete item.createdBy.request;
      delete item.createdBy.response;
      delete item.createdBy.accessToken;
      delete item.createdBy.attributes;
      delete item.createdBy.permission;
      delete item.createdBy.staffCode;

      // Set owner default value
      if (item.owner === undefined) {
        item.owner = {
          orgId: '',
          userId: '',
          appId: '',
        };
      }

      if (handler.permission) {
        let orgId =
          handler.permission.request['owner.orgId'] ||
          handler.permission.request.owner?.orgId ||
          '';
        let userId =
          handler.permission.request['owner.userId'] ||
          handler.permission.request.owner?.userId ||
          '';
        if (orgId === '{{orgId}}') {
          orgId = handler.orgId;
        }
        if (userId === '{{userId}}') {
          userId = handler.userId;
        }
        item.owner.orgId = orgId;
        item.owner.userId = userId;
      }
      // TODO: Remove this condition if all permission are refactored
      else if (typeof handler.request === 'object') {
        if (typeof handler.request.owner === 'object') {
          if (handler.request.owner.orgId === null) {
            item.owner.orgId = '';
          }
          if (handler.request.owner.userId === null) {
            item.owner.userId = '';
          }
          if (handler.request.owner.orgId === '{{orgId}}') {
            item.owner.orgId = handler.orgId;
          }
          if (handler.request.owner.userId === '{{userId}}') {
            item.owner.userId = handler.userId;
          }
        }
      }
      if (item.owner.orgId === undefined || item.owner.orgId === '') {
        //throw new BadRequestException(`Owner of resource is not defined!`);
        createManyResult.failureCount++;
      } else {
        items.push(item);
      }
    }
    logInfo('', 'base.service.createMany -> items', items);
    if (items.length > 0) {
      try {
        const createDataResult = await this._repo.save(items);
        createManyResult.successCount = createDataResult.length;
        logInfo(
          '',
          'base.service.createMany -> createDataResult',
          createDataResult,
        );
      } catch (error) {
        logInfo('', 'base.service.createMany -> error', error);
        createManyResult.failureCount = data.length;
      }
    }

    return createManyResult;
  }

  async updateOne(id: string, data: any, handler: DataHandler): Promise<T> {
    if (ObjectId.isValid(id)) {
      const where = {
        _id: ObjectId.createFromHexString(id),
      };
      if (handler.permission) {
        if (handler.permission.conditions) {
          if (handler.permission.conditions['owner.orgId'] === '{{orgId}}') {
            where['owner.orgId'] = handler.orgId;
          } else if (handler.permission.conditions['owner.orgId']) {
            where['owner.orgId'] = handler.permission.conditions['owner.orgId'];
          }
          if (handler.permission.conditions['owner.userId'] === '{{userId}}') {
            where['owner.userId'] = handler.userId;
          } else if (handler.permission.conditions['owner.userId']) {
            where['owner.userId'] =
              handler.permission.conditions['owner.userId'];
          }
        }
      }
      logInfo('*', 'base.service.updateOne -> where', where);
      const item: any = await this._repo.findOneBy(where);
      if (item === undefined || item === null || item.isDeleted === true) {
        throw new NotFoundException(`Resource id '${id}' not found!`);
      }

      // Handle check owner by permission.
      if (typeof handler.request === 'object') {
        if (typeof handler.request.owner === 'object') {
          let isOwner = true;
          if (handler.request.owner.orgId === '{{orgId}}') {
            isOwner =
              (item.owner !== undefined &&
                item.owner.orgId === handler.orgId) ||
              item.owner === undefined;
          }
          // TODO: fix this check user owner
          /* if (handler.request.owner.userId === '{{userId}}') {
            isOwner =
              (item.owner !== undefined &&
                (item.owner.userId === handler.userId ||
                  item.owner.userId === '')) ||
              item.owner === undefined;
          } */
          if (!isOwner) {
            throw new ForbiddenException(
              `You are not allow to access this resource id '${id}'`,
            );
          }
        }
      }

      data.changedAt = new Date();
      data.changedBy = JSON.parse(JSON.stringify(handler));

      // Delete roles, request, response to not store on changedBy
      delete data.changedBy.roles;
      delete data.changedBy.request;
      delete data.changedBy.response;
      delete data.changedBy.accessToken;
      delete data.changedBy.attributes;
      delete data.changedBy.permission;
      delete data.changedBy.staffCode;

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          item[key] = value;
        }
      }
      try {
        const updateResult = await this._repo.update(id, data);
        if (updateResult.affected) {
          // Handle response transform by permission
          if (typeof handler.response === 'object') {
            for (const key in handler.response) {
              if (handler.response[key] === null) {
                delete item[key];
              }
            }
          }
          return item;
        } else {
          throw new InternalServerErrorException(
            `Update item id '${id}' failed!`,
          );
        }
      } catch (error) {
        let errorMessage = 'Error in create new data!';
        switch (error.code) {
          case 11000: {
            errorMessage = `Duplicate key`;
            // TODO: Xử lý hiển thị field và value bị duplicate ra message.
            break;
          }
        }
        throw new BadRequestException(errorMessage);
      }
    } else {
      throw new NotFoundException(`Invalid id '${id}'`);
    }
  }

  async updateMany(
    condition: { [key: string]: any },
    data: any,
    handler: DataHandler,
  ): Promise<{
    modifiedCount: number;
    upsertedCount: number;
    matchedCount: number;
  }> {
    delete handler.accessToken;

    console.log(handler.request);
    data.changedAt = new Date();
    data.changedBy = JSON.parse(JSON.stringify(handler));

    // Delete roles, request, response to not store on changedBy
    delete data.changedBy.roles;
    delete data.changedBy.request;
    delete data.changedBy.response;

    try {
      const updateOptions = {
        $set: { ...data },
      };
      const updateResult = await this._repo.updateMany(
        condition,
        updateOptions,
      );
      const result = {
        modifiedCount: updateResult.modifiedCount || 0,
        upsertedCount: updateResult.upsertedCount || 0,
        matchedCount: updateResult.matchedCount || 0,
      };
      return result;
    } catch (error) {
      let errorMessage = 'Error in update many data!';
      switch (error.code) {
        default: {
          errorMessage = ``;
          break;
        }
      }
      throw new BadRequestException(errorMessage);
    }
  }

  async deleteOne(id: string, handler: DataHandler): Promise<DeleteOneResult> {
    if (ObjectId.isValid(id)) {
      const where = {
        _id: ObjectId.createFromHexString(id),
      };
      if (handler.permission) {
        if (handler.permission.conditions) {
          if (handler.permission.conditions['owner.orgId'] === '{{orgId}}') {
            where['owner.orgId'] = handler.orgId;
          } else if (handler.permission.conditions['owner.orgId']) {
            where['owner.orgId'] = handler.permission.conditions['owner.orgId'];
          }
          if (handler.permission.conditions['owner.userId'] === '{{userId}}') {
            where['owner.userId'] = handler.userId;
          } else if (handler.permission.conditions['owner.userId']) {
            where['owner.userId'] =
              handler.permission.conditions['owner.userId'];
          }
        }
      }
      logInfo('*', 'base.service.deleteOne -> where', where);
      const item: any = await this._repo.findOneBy(where);
      const data: any = {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: JSON.parse(JSON.stringify(handler)),
      };

      // Delete roles, request, response to not store on changedBy
      delete data.deletedBy.role;
      delete data.deletedBy.roles;
      delete data.deletedBy.request;
      delete data.deletedBy.response;
      delete data.deletedBy.accesstoken;
      delete data.deletedBy.attributes;
      delete data.deletedBy.permission;

      if (item === undefined || item === null || item.isDeleted === true) {
        throw new NotFoundException(`Resource id '${id}' not found!`);
      }
      // Handle check owner by permission
      if (handler.permission) {
      }
      // TODO: remove this check owner logic if all Services Permission is updated
      else {
        if (typeof handler.request === 'object') {
          if (typeof handler.request.owner === 'object') {
            let isOwner = true;
            if (handler.request.owner.orgId === '{{orgId}}') {
              isOwner =
                item.owner !== undefined && item.owner.orgId === handler.orgId;
            }
            if (handler.request.owner.userId === '{{userId}}') {
              isOwner =
                item.owner !== undefined &&
                (item.owner.userId === handler.userId ||
                  item.owner.userId === '');
            }
            if (!isOwner) {
              throw new ForbiddenException(
                `You are not allow to access this resource id '${id}'`,
              );
            }
          }
        }
      }

      const updateResult = await this._repo.update(id, data);

      if (updateResult.affected) {
        const deleteResult: DeleteOneResult = {
          id,
          deletedAt: new Date(),
        };

        return deleteResult;
      } else {
        throw new InternalServerErrorException(
          `Delete item id '${id}' failed!`,
        );
      }
    } else {
      throw new NotFoundException(`Invalid id '${id}'`);
    }
  }
}
