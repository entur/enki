import { DaytypesEditorProps } from './types';
import { SandboxComponent } from '../../../config/SandboxFeature';
import { updateFoo, useDaytypesSelector } from './daytypesSlice';
import { TextField } from '@entur/form';
import { useAppDispatch } from '../../../app/hooks';

export const DaytypesEditor: SandboxComponent<DaytypesEditorProps> = () => {
  const foo = useDaytypesSelector((state) => state.daytypes.foo);
  const dispatch = useAppDispatch();
  return (
    <div style={{ height: '200px' }}>
      <h1>Hello {foo}</h1>
      <TextField
        label="Foo"
        value={foo}
        onChange={(e) => dispatch(updateFoo(e.target.value))}
      />
    </div>
  );
};
