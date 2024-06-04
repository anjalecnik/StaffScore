import { Edit, SimpleForm, TextInput } from 'react-admin';

export const SurveyEdit = (props : any) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

export default SurveyEdit;
