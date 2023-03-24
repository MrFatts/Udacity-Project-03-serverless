import { TodosAccess } from '../DataLayer/todosAcess'
import { Attachmentutils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'


const logger = createLogger('Todoaccess')
const attachmentutils = new Attachmentutils()
const todosAccess = new TodosAccess()

//write the function to create a new todo item
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
):    Promise<TodoItem> {
    logger.info('createTodo', {newTodo, userId})
    
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3attachmenturl = attachmentutils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3attachmenturl,
        ...newTodo
    }
return await todosAccess.createTodoItem(newItem)    
}


// /**
//  * Creates a new todo item
//  * @param userId
//  * @param createRequest
//  * @returns {object} - todo item
//  */
// export const createTodoItem = async (
//   userId: string,
//   createRequest: CreateTodoRequest
// ): Promise<TodoItem | Error> => {
//   const todoItemId = uuid.v4()
//   const todoItem: TodoItem = {
//     userId,
//     todoItemId,
//     createdAt: new Date().toISOString(),
//     done: false,
//     attachmentUrl: null,
//     ...createRequest
//   }
//   try {
//     await todoAccess.createTodoItem(todoItem)
//     log.info(`Create todo item: `, {
//       todoItem
//     })
//     return todoItem as TodoItem
//   } catch (e) {
//     log.error(`Create todo item: `, {
//       Error: e,
//       todoItem
//     })
//     return createError(403, `Unauthorized.`)
//   }
// }

// /**
//  * Get todo items
//  * @param userId
//  * @returns
//  */
// export const getTodoItems = async (userId: string): Promise<TodoItem[] | Error> => {
//   try {
//     const userTodoItems = await todoAccess.getTodoItems(userId)
//     log.info(`Get user todo items: `, {
//       userTodoItems
//     })
//     return userTodoItems as TodoItem[]
//   } catch (e) {
//     log.error(`Get user todo items: `, {
//       Error: e,
//       userId
//     })
//     return createError(403, `Unauthorized.`)
//   }
// }

// /**
//  * Update todo item
//  * @param userId
//  * @param todoItemId
//  * @param updateRequest
//  * @returns
//  */
// export const updateTodoItem = async (
//   userId: string,
//   todoItemId: string,
//   updateRequest: UpdateTodoRequest
// ): Promise<void | Error> => {
//   try {
//     await todoAccess.updateTodoItem(userId, todoItemId, updateRequest)
//     log.info(`Update todo item: `, {
//       userId,
//       todoItemId,
//       updateRequest
//     })
//   } catch (e) {
//     log.error(`Update todo item: `, {
//       Error: e,
//       userId,
//       todoItemId,
//       updateRequest
//     })
//     return createError(403, `Unauthorized.`)
//   }
// }

// /**
//  * Delete todo item
//  * @param userId
//  * @param todoItemId
//  * @returns
//  */
// export const deleteTodoItem = async (
//   userId: string,
//   todoItemId: string
// ): Promise<void | Error> => {
//   try {
//     await todoAccess.deleteTodoItem(userId, todoItemId)
//     log.info(`Delete todo item: `, {
//       userId,
//       todoItemId
//     })
//   } catch (e) {
//     log.error(`Delete todo item: `, {
//       Error: e,
//       userId,
//       todoItemId
//     })
//     return createError(403, `Unauthorized.`)
//   }
// }

// /**
//  * Upload image
//  * @param userId 
//  * @param todoItemId 
//  * @param attachmentId 
//  * @returns 
//  */
// export const uploadTodoItemImage = async (
//   userId: string,
//   todoItemId: string,
//   attachmentId:
//