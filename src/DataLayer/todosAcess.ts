import * as AWS from 'aws-sdk';
//import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';
var AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('TodosAccess');
//const databaseTable = process.env.TODOS_TABLE;

// const secondaryIndex = process.env.TODOS_INDEX;
// const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_INDEX
    ) {}

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos')

        const result = await this.docClient
        .query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Creating a new todo item')

        const result = await this.docClient
        .put({
            TableName: this.todosTable,
            Item: todoItem
        })
        .promise()
        logger.info('New todo item created result', result)

        return todoItem as TodoItem
    }

    async updateTodoItem(
        todoId: string, 
        userId: string, 
        todoUpdate: TodoUpdate
    ): Promise<TodoUpdate> {
        logger.info('Updating a todo item')

        await this.docClient
        .update({
            TableName: this.todosTable,
            Key: {
            todoId,
            userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':dueDate': todoUpdate.dueDate,
        ':done': todoUpdate.done
        },
        ExpressionAttributeNames: {
        '#name': 'name'
        }
    })
    .promise()

    return todoUpdate as TodoUpdate
    }

    async deleteTodoItem(todoId: string, userId: string): Promise<void> {
        logger.info('Deleting a todo item')

        await this.docClient
        .delete({
            TableName: this.todosTable,
            Key: {
            todoId,
            userId
            }
        })
        .promise()
    }
    
    async updateTodoAttachmentUrl(
        TodoId: string,
        userId: string,
        attachmentUrl: string
    ): Promise<void> {
        logger.info('Updating a todo attachment url')

        await this.docClient
        .update({
            TableName: this.todosTable,
            Key: {
            todoId: TodoId,
            userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
        }
    })
        .promise()
    }
}


//   /**
//    * Checking if an item might already exists
//    * @param userId
//    * @param todoId
//    * @returns Object
//    */
//   async isExisting(userId: string, todoId: string): Promise<unknown> {
//     const itemExist = await docClient
//       .get({
//         TableName: databaseTable,
//         Key: {
//           userId,
//           todoId
//         }
//       })
//       .promise();
//     if (!itemExist) logger.info(`${todoId} - Query failed, item not found`);
//     return !!itemExist.Item;
//   }

//   /**
//    * Generate a new upload url and update DynamoDB with the new url
//    * @param userId
//    * @param todoId
//    * @param attachmentUrl
//    */
//   async generateUploadUrl(
//     userId: string,
//     todoId: string,
//     attachmentUrl: string
//   ): Promise<void> {
//     if (!(await this.isExisting(userId, todoId))) {
//       logger.info(`Generate image URL -> Invalid todoId`, {
//         todoId,
//         userId,
//         attachmentUrl
//       });
//       throw new Error(`Invalid todo`);
//     }
//     const DatabaseSet = await docClient
//       .update({
//         TableName: databaseTable,
//         Key: {
//           userId,
//           todoId
//         },
//         UpdateExpression: 'set attachmentUrl = :attachmentUrl',
//         ExpressionAttributeValues: {
//           ':attachmentUrl': attachmentUrl
//         }
//       })
//       .promise();
//     logger.info('generateUploadUrl -> ', {
//       userId,
//       todoId,
//       attachmentUrl,
//       DatabaseSet
//     });
//   }

//   /**
//    * Create new todo
//    * @param {object} todoItem - todo item data
//    * @returns {object} - the new todo item
//    */
//   async createTodo(todoItem: TodoItem): Promise<TodoItem> {
//     await docClient
//       .put({
//         TableName: databaseTable,
//         Item: todoItem
//       })
//       .promise();
//     logger.info('New todo item created: ', {
//       todoItem
//     });
//     return todoItem;
//   }

//   /**
//    * Get todo list
//    * @param userId
//    * @returns {array} - todo item list
//    */
//   async getTodos(userId: string): Promise<TodoItem[]> {
//     const Query = await docClient
//       .query({
//         TableName: databaseTable,
//         IndexName: secondaryIndex,
//         KeyConditionExpression: 'userId = :userId',
//         ExpressionAttributeValues: {
//           ':userId': userId
//         }
//       })
//       .promise();
//     if (!Query) throw new Error(`Failed, try again!`);
//     const todosList = Query.Items;
//     logger.info(`Get user todos ->`, {
//       todos: todosList as TodoItem[]
//     });
//     return todosList as TodoItem[];
//   }

//   /**
//    * Delete todo item
//    * @param userId
//    * @param todoId
//    */
// }