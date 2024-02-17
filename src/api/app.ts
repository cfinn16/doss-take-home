import express from 'express'
import cors from 'cors'
import { addTableToWorkspace, createWorkspace, getWorkspace, getWorkspaces, updateWorkspace } from './util'
import { reset } from './db/db'

const app = express()
app.use(cors())
app.use(express.json())

const port = 8080
const dbString = '../database.txt'

/** Admin endpoint for resetting the database */
app.get('/reset', (req, res) => {
  reset(dbString)
  res.send('Reset database')
})

/** Returns the workspace with the given ID */
app.get('/:workspaceId', (req, res) => {
  res.json({ workspace: getWorkspace(dbString, req.params.workspaceId) })
})

/** Updates the workspace with the given ID and returns the updated workspace */
app.post('/:workspaceId', (req, res) => {
  const workspace = req.body.workspace
  res.json({ workspace: updateWorkspace(dbString, workspace) })
})

/** Returns all workspaces in the database */
app.get('/', (req, res) => {
  const allWorkspaces = getWorkspaces(dbString)
  const workspaces = allWorkspaces.map((workspace) => ({
    id: workspace.id,
    title: workspace.title,
  }))
  res.json({ workspaces })
})

/** Creates a new workspace in the database and returns it */
app.post('/', (req, res) => {
  res.json({ workspace: createWorkspace(dbString) })
})

/** Creates a new table in an existing workspace and returns the workspace */
app.post('/:workspaceId/tables', (req, res) => {
  res.json({ workspace: addTableToWorkspace(dbString, req.body.workspaceId)})
})

module.exports = app

app.listen(port, () => {
  console.log(`Dosspace is running on port ${port}.`)
})
