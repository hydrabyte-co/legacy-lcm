import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { plainToClass } from 'class-transformer';
import { handleClassValidation } from 'src/utils/validator-helper';
import { CreateFooDTO } from './dto/create.dto';
import { UpdateFooDTO } from './dto/update.dto';
import { Foo } from './entities/foo.entity';

@Injectable()
export class FoosService {
  constructor(
    @InjectRepository(Foo)
    private readonly foosRepository: MongoRepository<Foo>,
  ) {}

  async create(createPhonefooDto: CreateFooDTO): Promise<Foo> {
    const foo = plainToClass(Foo, createPhonefooDto);
    await handleClassValidation(foo);
    return await this.foosRepository.save(foo);
  }

  async findAll(queryObject?: any): Promise<Foo[]> {
    let fullQueryObject = { where: { isDeleted: false } };
    if (typeof queryObject === 'object') {
      fullQueryObject = { ...queryObject };
      if (!fullQueryObject.where) {
        fullQueryObject.where = { isDeleted: false };
      }
      if (fullQueryObject.where.isDeleted === undefined) {
        fullQueryObject.where.isDeleted = false;
      }
    }
    return await this.foosRepository.find(fullQueryObject);
  }

  async findOne(filterObject: any): Promise<Foo> {
    const foo = await this.foosRepository.findOne(filterObject);
    if (foo && !foo.isDeleted) {
      return foo;
    }
    throw new NotFoundException();
  }

  async findOneById(id: string): Promise<Foo> {
    if (ObjectID.isValid(id)) {
      const foo = await this.foosRepository.findOne(ObjectID(id));
      if (foo && !foo.isDeleted) {
        return foo;
      }
    }
    throw new NotFoundException();
  }

  async update(id: string, updatePhonefooDto: UpdateFooDTO): Promise<Foo> {
    if (ObjectID.isValid(id)) {
      const updateResult = await this.foosRepository.update(
        id,
        updatePhonefooDto,
      );

      if (updateResult.affected > 0) {
        return await this.foosRepository.findOne(ObjectID(id));
      }
    }
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    // TODO: xử lý trường hợp update dữ liệu không có thay đổi thì vẫn cần trả về object thay vì báo notfound
    if (ObjectID.isValid(id)) {
      const changedData = {
        isDeleted: true,
      };
      const updateResult = await this.foosRepository.update(id, changedData);

      if (updateResult.affected > 0) {
        return undefined;
      }
    }
    throw new NotFoundException();
  }

  async doJob(input: any): Promise<void> {
    console.log(`doJob with param '${input}'`);
  }
}
