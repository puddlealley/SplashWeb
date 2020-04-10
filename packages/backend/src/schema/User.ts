import {objectType} from "nexus";
import {ObjectDefinitionBlock} from "nexus/dist/definitions/objectType";
import {Node} from "./Node"

export const User = objectType({
    name: 'User',
    definition(t: ObjectDefinitionBlock<'User'> ) {
        t.implements(Node);
        t.id("id", {
            resolve: ({user_id}) => `user_${user_id}`,
        });
        t.model.user_id();
        t.model.email();
    },
});