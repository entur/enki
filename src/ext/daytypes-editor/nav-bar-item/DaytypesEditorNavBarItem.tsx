import React from 'react';
import { NavBarItem } from '../../../scenes/App/components/NavBar';
import { SandboxComponent } from '../../../config/SandboxFeature';
import { DayTypesEditorNavBarItemProps } from './types';

export const DaytypesEditorNavBarItem: SandboxComponent<
  DayTypesEditorNavBarItemProps
> = ({ setRedirect }) => {
  return (
    <NavBarItem text="Daytypes" path="/daytypes" setRedirect={setRedirect} />
  );
};
