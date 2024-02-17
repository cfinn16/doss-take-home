import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DosspaceApi from '../api'

interface Shipment {
  id: string
  description: string
  orderNumber: string
  cost: number
}

interface ShipmentTable {
  id: string
  buildNumber: string
  shipments: Shipment[]
}

export interface DetailWorkspace {
  id: string
  title: string
  buildShipments: ShipmentTable[]
}

type WorkspaceDetailsParams = {
  workspaceId: string
}

/** Detail view of individual workspace */
export default function WorkspaceDetails() {
  const { workspaceId } = useParams() as WorkspaceDetailsParams
  const [workspace, setWorkspace] = useState<DetailWorkspace | null>(null)

  async function fetchWorkspace() {
    const workspace = await DosspaceApi.getWorkspace(workspaceId)
    console.log(workspace)
    setWorkspace(workspace)
  }

  async function handleAddTable() {
    await DosspaceApi.createTable(workspaceId)
    fetchWorkspace()
  }

  // Fetch all workspaces from the API
  useEffect(() => {
    fetchWorkspace()
  }, [workspaceId])

  return (
    <>
      {workspace?.buildShipments.map((shipment) => {
        return (
          <>
            <p>Shipment no. {shipment.buildNumber}</p>
            <table cellPadding="10" style={{marginBottom: '3rem', textAlign: 'left'}}>
              <thead>
                <tr>
                  <th scope="column">Order Number</th>
                  <th scope="column">Description</th>
                  <th scope="column">Cost</th>
                </tr>
              </thead>
              <tbody>
                {shipment.shipments.map((x: Shipment) => {
                  return (
                    <tr>
                      <td>{x.orderNumber}</td>
                      <td>{x.description}</td>
                      <td>${x.cost / 100}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )
      })}
      <button onClick={handleAddTable}>Add Table</button>
    </>
  )
}
