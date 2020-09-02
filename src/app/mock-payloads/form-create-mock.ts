export const formCreateMock = {
    data: {
        project: {
            employee: {
                name: 'john',
                email: 'john.cena@foo.com',
                grade: 12
            },
            operation: {
                cost: 1222,
                location: 'usa',
                startDate: '2020-03-31T15:23:45.352+0000',
                estimatedEndDate: '2024-01-31T15:23:45.352+0000'
            }
        }
    },
    config: {
        elements: [
            {
                name: 'name',
                label: 'Name',
                disabled: false,
                type: 'input',
                sourcePath: 'project.employee.name',
                validators: [
                    {
                        validator: 'required'
                    },
                    {
                        validator: 'minLength',
                        validatorArgument: '4'
                    }
                ]
                // todo: give specific information to determine location on page/flexibility of styling?
            },
            {
                name: 'email',
                label: 'Email',
                disabled: false,
                type: 'input',
                sourcePath: 'project.employee.email'
            },
            {
                name: 'grade',
                label: 'Grade',
                disabled: false,
                type: 'select',
                options: [
                    { id: 1, name: 1 },
                    { id: 2, name: 2 },
                    { id: 3, name: 3 },
                    { id: 4, name: 4 },
                    { id: 5, name: 5 },
                    { id: 6, name: 6 },
                    { id: 7, name: 7 },
                    { id: 8, name: 8 },
                    { id: 9, name: 9 },
                    { id: 10, name: 10 },
                    { id: 11, name: 11 },
                    { id: 12, name: 12 },
                ],
                sourcePath: 'project.employee.grade'
            },
        ]
    }
}



//     config: {
//         groupName: 'project',
//         itemDetails: {
//             role: 'content-zone-container',
//             type: 'contentContainer',
//             spec: [
//                 {
//                     groupName: 'employee',
//                     itemDetails: {
//                         role: 'product-container',
//                         type: 'contentContainer',
//                         //   headerComponent: {
//                         //     type: 'basicHeader',
//                         //     title: 'Product',
//                         //     headerRole: 'product-container__header'
//                         //   },
//                         spec: [
//                             {
//                                 itemDetails: {
//                                     label: 'Name',
//                                     // disabled: false,
//                                     name: 'name',
//                                     type: 'input',
//                                     sourcePath: 'project.employee.name'
//                                 }
//                             },
//                             {
//                                 itemDetails: {
//                                     label: 'Email',
//                                     // disabled: false,
//                                     name: 'email',
//                                     type: 'input',
//                                     sourcePath: 'project.employee.email'
//                                 }
//                             },
//                             {
//                                 itemDetails: {
//                                     label: 'Grade',
//                                     // disabled: false,
//                                     name: 'grade',
//                                     type: 'select',
//                                     options: [
//                                         { id: 1, name: 1 },
//                                         { id: 2, name: 2 },
//                                         { id: 3, name: 3 },
//                                         { id: 4, name: 4 },
//                                         { id: 5, name: 5 },
//                                         { id: 6, name: 6 },
//                                         { id: 7, name: 7 },
//                                         { id: 8, name: 8 },
//                                         { id: 9, name: 9 },
//                                         { id: 10, name: 10 },
//                                         { id: 11, name: 11 },
//                                         { id: 12, name: 12 },
//                                     ],
//                                     sourcePath: 'project.employee.grade'
//                                 }
//                             },

//                         ]
//                     }
//                 }
//             ]
//         }
//     }
// };
