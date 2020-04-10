import {mutationType} from "nexus";

export const Mutation = mutationType({
    definition(t) {
        t.crud.createOneUser({
            computedInputs: {
                email: ({args, ctx, info}) => "mail",
            }
        });
        t.crud.deleteOneUser();
    },
});