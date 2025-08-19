import * as React from 'react';
import {
  NormalPeoplePicker,
  IBasePickerSuggestionsProps,
  ValidationState,
  IPeoplePickerItemSelectedProps,
  PeoplePickerItem
} from '@fluentui/react/lib/Pickers';
import { Stack } from '@fluentui/react/lib/Stack';
import { stackTokens, stackStyles, columnProps } from '../styles/ModelStyles';
import { IPersonaProps } from '@fluentui/react/lib/Persona';

import { getUsersFromGraph } from '../services/GraphService';
import { AadHttpClient } from '@microsoft/sp-http';


export interface IPeoplePickerComponentProps {
  aadClient: AadHttpClient;
  onSelectionChanged: (selectedUsers: IPersonaProps[]) => void;
}

const PeoplePickerComponent: React.FC<IPeoplePickerComponentProps> = ({ aadClient ,onSelectionChanged}) => {
  const [peopleList, setPeopleList] = React.useState<IPersonaProps[]>([]);
  const [selectedPeople, setSelectedPeople] = React.useState<IPersonaProps[]>([]);

  const suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested People',
    noResultsFoundText: 'No results found',
    showRemoveButtons: true,
  };

  React.useEffect(() => {
    const fetchInitialUsers = async () => {
      const users = await getUsersFromGraph(aadClient);
      setPeopleList(users);
    };
    fetchInitialUsers();
  }, []);

const onFilterChanged = async (
  filterText: string,
  currentPersonas: IPersonaProps[],
  limitResults?: number
): Promise<IPersonaProps[]> => {
  if (!filterText && peopleList.length > 0) {
    return peopleList.filter(p => !currentPersonas.some(cp => cp.text === p.text));
  }

  const users = await getUsersFromGraph(aadClient, filterText);
  return users.filter(p => !currentPersonas.some(cp => cp.text === p.text));
};

  const renderItemWithSecondaryText = (props: IPeoplePickerItemSelectedProps) => {
    return <PeoplePickerItem {...props} />;
  };

  const getTextFromItem = (persona: IPersonaProps): string => persona.text || '';

  const validateInput = (input: string): ValidationState => {
    return input.includes('@') ? ValidationState.valid : ValidationState.invalid;
  };

  const onInputChange = (input: string): string => {
    const match = /<(.+)>/.exec(input);
    return match && match[1] ? match[1] : input;
  };

  return (
    <Stack tokens={stackTokens} styles={stackStyles}>
      <Stack horizontal tokens={stackTokens}>
        <Stack {...columnProps}>
          <NormalPeoplePicker
            label="Send email to"
            onResolveSuggestions={onFilterChanged}
            getTextFromItem={getTextFromItem}
            pickerSuggestionsProps={suggestionProps}
            onRemoveSuggestion={() => {}}
            onRenderItem={renderItemWithSecondaryText}
            onValidateInput={validateInput}
            selectionAriaLabel={'Selected contacts'}
            removeButtonAriaLabel={'Remove'}
            onInputChange={onInputChange}
            resolveDelay={300}
            selectedItems={selectedPeople}
            onChange={(items) => {
                const updated = items || [];
                setSelectedPeople(updated);
                onSelectionChanged(updated); // Notify parent
                }}
            required={true}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PeoplePickerComponent;