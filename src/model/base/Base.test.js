import Versioned from './Versioned';

class TestEntity extends Versioned {
  constructor(data) {
    super();
    this.testField = data.testField;
  }
}

it('handles scalar fields', () => {
  let testEntity = new TestEntity({ testField: 'foobar' });
  expect(testEntity.testField).toEqual('foobar');
  testEntity = testEntity.withFieldChange('testField', 'foobaz');
  expect(testEntity.testField).toEqual('foobaz');
});

it('handles array fields', () => {
  let testEntity = new TestEntity({ testField: ['foo', 'bar'] });
  expect(testEntity.testField).toEqual(['foo', 'bar']);
  testEntity = testEntity.withFieldChange('testField', 'bar', true);
  expect(testEntity.testField).toEqual(['foo']);
  testEntity = testEntity.withFieldChange('testField', 'bar', true);
  expect(testEntity.testField).toEqual(['foo', 'bar']);
});
