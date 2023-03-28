import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
// export interface attachmentData {
// 	putObject: any,
// 	uploadUrl: string
// }
// TODO: implement the business logic of the attachmentUtils
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpire = 300
//const target = new XAWS.S3({ signatureVersion: 'v4' })

export class Attachmentutils {
	constructor(
		private readonly s3bucket = new XAWS.S3({ signatureVersion: 'v4' }),
		private readonly nameOfBucket = s3BucketName,
		
		
	) {}

	getAttachmentUrl(todoId: string): string {
		return `https://${this.nameOfBucket}.s3.amazonaws.com/${todoId}`
	}

	getUploadUrl(todoId: string): string {
		console.log('getUploadUrl')
		const url = this.s3bucket.getSignedUrl('putObject', {
			Bucket: this.nameOfBucket,
			Key: todoId,
			Expires: urlExpire
		})
		return url as string
	}
}
