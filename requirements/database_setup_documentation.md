 Users Table
Purpose: Stores user data, including authentication credentials and profile details.
Key Attributes:
user_id (UUID, Primary Key): Unique identifier for each user, generated automatically using gen_random_uuid().
email: User's email address for login (unique).
password_hash: Encrypted password.
name: User's display name.
profile_picture_url: Link to the user's profile picture.
created_at and updated_at: Timestamps for user creation and updates.
Policies:
Users can view and update only their own profile data by matching their user_id with the authenticated user's ID (auth.uid()).
No user can access another user's data.
2. Roles Table
Purpose: Defines roles for role-based access control, such as "Admin," "Manager," or "User."
Key Attributes:
role_id (UUID, Primary Key): Unique identifier for each role, generated with gen_random_uuid().
role_name: Name of the role (e.g., Admin).
description: Description of the role.
Policies:
Only administrators can view all roles.
Regular users are restricted from accessing or modifying roles.
3. UserRoles Table
Purpose: Links users to roles, enabling granular access control.
Key Attributes:
user_role_id (UUID, Primary Key): Unique identifier for each user-role relationship, generated with gen_random_uuid().
user_id (UUID, Foreign Key): References the Users table.
role_id (UUID, Foreign Key): References the Roles table.
Policies:
Users can view their own roles by matching their user_id with the authenticated user's ID.
Administrators can view, insert, update, and delete any user-role relationships.
4. Projects Table
Purpose: Tracks user-created projects, including their details, timelines, and statuses.
Key Attributes:
project_id (UUID, Primary Key): Unique identifier for each project, generated automatically.
name: Project name.
description: Detailed project description.
start_date and end_date: Project timeline.
status: Current project status (e.g., Pending, In Progress, Completed).
created_by (UUID, Foreign Key): References the Users table for the project creator.
created_at and updated_at: Timestamps for project creation and updates.
Policies:
Project creators or collaborators can view and update projects they are linked to.
Only the project creator can insert new projects or delete their own projects.
5. Tasks Table
Purpose: Manages tasks associated with projects, including details, deadlines, and assignees.
Key Attributes:
task_id (UUID, Primary Key): Unique identifier for each task, generated automatically.
project_id (UUID, Foreign Key): References the Projects table.
title: Task title.
description: Detailed description of the task.
status: Task status (e.g., To Do, In Progress, Completed).
due_date: Task deadline.
assigned_to (UUID, Foreign Key): References the Users table for the assignee.
created_at and updated_at: Timestamps for task creation and updates.
Policies:
Project collaborators and task assignees can view tasks they are linked to.
Only task assignees can update or delete tasks assigned to them.
Project collaborators can insert new tasks for their projects.
6. Notifications Table
Purpose: Tracks notifications sent to users for updates or alerts in the application.
Key Attributes:
notification_id (UUID, Primary Key): Unique identifier for each notification.
user_id (UUID, Foreign Key): References the Users table for the recipient.
message: Content of the notification.
is_read: Boolean flag to track if the notification has been read.
created_at: Timestamp for notification creation.
Policies:
Users can only view notifications addressed to them.
Users can update their notifications (e.g., marking them as read).
System processes can insert new notifications for users.
7. Attachments Table
Purpose: Handles file uploads and attachments linked to projects or tasks.
Key Attributes:
attachment_id (UUID, Primary Key): Unique identifier for each attachment.
entity_type: Type of entity the file is attached to (Project or Task).
entity_id: ID of the associated project or task.
file_url: URL to the uploaded file.
uploaded_by (UUID, Foreign Key): References the Users table for the uploader.
uploaded_at: Timestamp for the upload.
Policies:
Users can view attachments linked to projects or tasks they are part of.
Only the uploader or project collaborators can delete attachments.
8. TimeLogs Table
Purpose: Tracks time logged by users for tasks, including durations and dates.
Key Attributes:
log_id (UUID, Primary Key): Unique identifier for each time log.
task_id (UUID, Foreign Key): References the Tasks table.
user_id (UUID, Foreign Key): References the Users table.
hours_spent: Number of hours logged.
log_date: Date of the time log.
Policies:
Users can only view, insert, and update their own time logs.
9. PMVData Table
Purpose: Stores JSON-based data for PMV (Project Milestone Visualization) models.
Key Attributes:
pmv_id (UUID, Primary Key): Unique identifier for each PMV entry.
project_id (UUID, Foreign Key): References the Projects table.
data: JSONB field containing PMV data.
updated_at: Timestamp for the last update.
Policies:
Only project collaborators can view, insert, and update PMV data.
10. CanvasModels Table
Purpose: Manages JSON-based canvas models linked to projects.
Key Attributes:
model_id (UUID, Primary Key): Unique identifier for each canvas model.
project_id (UUID, Foreign Key): References the Projects table.
model_data: JSONB field containing the model data.
created_by (UUID, Foreign Key): References the Users table for the creator.
created_at and updated_at: Timestamps for model creation and updates.
Policies:
Only project collaborators can view, insert, and update canvas models.
11. Reports Table
Purpose: Stores user-generated reports and their configurations.
Key Attributes:
report_id (UUID, Primary Key): Unique identifier for each report.
user_id (UUID, Foreign Key): References the Users table.
name: Report name.
parameters: JSONB field storing the report configuration.
created_at and updated_at: Timestamps for report creation and updates.
Policies:
Users can only view, insert, and update their own reports.
Final Notes
UUID Usage: All primary keys are UUIDs generated automatically using gen_random_uuid().
RLS Policies: Provide strict control over who can view, insert, update, or delete data in each table.
Relationships: Every table uses UUID foreign keys to maintain data integrity and ensure seamless relationships between tables.