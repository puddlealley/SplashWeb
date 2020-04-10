import {DocumentNode, print} from 'graphql';
import {GraphQLExtension, GraphQLResponse} from 'graphql-extensions';

export enum LogAction {
    request,
    parse,
    validation,
    execute,
    setup,
    cleanup,
}

export enum LogStep {
    start,
    end,
    status,
}

export interface LogMessage {
    action: LogAction;
    step: LogStep;
    key?: string;
    data?: any;
}

export interface LogFunction {
    (message: LogMessage);
}

// A GraphQLExtension that implements the existing logFunction interface. Note
// that now that custom extensions are supported, you may just want to do your
// logging as a GraphQLExtension rather than write a LogFunction.

class LogFunctionExtension<TContext = any> implements GraphQLExtension<TContext> {
    private logFunction: LogFunction;
    public constructor(logFunction: LogFunction) {
        this.logFunction = logFunction;
    }

    public requestDidStart(options) {
        this.logFunction({action: LogAction.request, step: LogStep.start});
        const loggedQuery = options.queryString || print(options.parsedQuery);
        this.logFunction({
            action: LogAction.request,
            step: LogStep.status,
            key: 'query',
            data: loggedQuery.replace(/(?:\r\n|\r|\n)/g, '').replace(/\\"/, '"').replace(/\s+/g,' '),
        });
        this.logFunction({
            action: LogAction.request,
            step: LogStep.status,
            key: 'variables',
            data: options.variables,
        });
        this.logFunction({
            action: LogAction.request,
            step: LogStep.status,
            key: 'operationName',
            data: options.operationName,
        });

        return (...errors: Error[]) => {
            // If there are no errors, we log in willSendResponse instead.
            if (errors.length) {
                this.logFunction({action: LogAction.request, step: LogStep.end});
            }
        };
    }

    public parsingDidStart() {
        this.logFunction({action: LogAction.parse, step: LogStep.start});
        return () => {
            this.logFunction({action: LogAction.parse, step: LogStep.end});
        };
    }

    public validationDidStart() {
        this.logFunction({action: LogAction.validation, step: LogStep.start});
        return () => {
            this.logFunction({action: LogAction.validation, step: LogStep.end});
        };
    }

    public executionDidStart() {
        this.logFunction({action: LogAction.execute, step: LogStep.start});
        return () => {
            this.logFunction({action: LogAction.execute, step: LogStep.end});
        };
    }

    public willSendResponse(o: {graphqlResponse: GraphQLResponse}) {
        this.logFunction({
            action: LogAction.request,
            step: LogStep.end,
            key: 'response',
            data: o.graphqlResponse,
        });
    }
}

export const graphqlLogFunction = (logger) => () =>
    new LogFunctionExtension(message => {
        if (message.key === 'query') {
            logger.log({
                level: 'info',
                message
            });
        } else if(message.key === 'variables'){
            logger.log({
                level: 'info',
                message
            });
        }
        else if (message.key === 'response') {
            logger.log({
                level: 'info',
                message
            });
        }
    })