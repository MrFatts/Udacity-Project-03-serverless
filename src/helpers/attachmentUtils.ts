import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
// export interface attachmentData {
// 	putObject: any,
// 	uploadUrl: string
// }
// TODO: implement the business logic of the attachmentUtils
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpire = process.env.SIGNED_URL_EXPIRATION
//const target = new XAWS.S3({ signatureVersion: 'v4' })

export class Attachmentutils {
	constructor(
		private readonly s3bucket = new XAWS.S3({ signatureVersion: 'v4' }),
		private readonly Nameofbucket = s3BucketName,
	) {}

	getAttachmentUrl(todoId: string) {
		return `https://${this.Nameofbucket}.s3.amazonaws.com/${todoId}`
	}

	getUploadUrl(todoId: string): string {
		const url = this.s3bucket.getSignedUrl('putObject', {
			Bucket: this.Nameofbucket,
			Key: todoId,
			Expires: urlExpire
		})
		return url as string
	}
}
