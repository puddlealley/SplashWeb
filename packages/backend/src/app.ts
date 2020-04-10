import {PrismaClient} from '@prisma/client'
import {GraphQLServer} from 'graphql-yoga'
import {makeSchema} from 'nexus'
import {nexusPrismaPlugin} from 'nexus-prisma'
import * as path from 'path'
import {GraphQLSchema} from "graphql";
import {User} from "./schema/User";
import {Query} from "./schema/Query";
import {Mutation} from "./schema/Mutation";

const prisma = new PrismaClient();

const config = makeSchema({
    typegenAutoConfig: {
        contextType: '{ prisma: PrismaClient.PrismaClient }',
        sources: [{source: '@prisma/client', alias: 'PrismaClient'}],
    },
    outputs: {
        typegen: path.join(
            __dirname,
            '../../../node_modules/@types/nexus-typegen/index.d.ts',
        ),
        schema: path.join(
            __dirname,
            'schema.graphql',
        ),
    },
    plugins: [nexusPrismaPlugin()],
    types: [Query, Mutation, User],
});

new GraphQLServer({
    context: () => ({prisma}),
    schema: config as GraphQLSchema
}).start(() => console.log(`🚀 GraphQL service ready at http://localhost:4000`));
