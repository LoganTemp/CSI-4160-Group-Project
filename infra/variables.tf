variable "project" {
  description = "Project prefix"
  type        = string
  default     = "newsfusion"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

variable "s3_bucket_name" {
  description = "Unique bucket name for static site"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "Ubuntu 22.04 AMI id for the chosen region"
  type        = string
  # us-east-2 Ubuntu 22.04 LTS as of late 2025; update if needed
  default     = "ami-0b23bbdd4aee3a9ef"
}

variable "ec2_key_name" {
  description = "Existing EC2 key pair name"
  type        = string
}

variable "backend_port" {
  description = "Backend port to expose"
  type        = number
  default     = 3001
}
