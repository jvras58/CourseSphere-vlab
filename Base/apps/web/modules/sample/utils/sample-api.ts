import { SampleFilters } from "@/types"
import { SampleFormValues } from "../schemas/sample-schema"

function buildQuery(filters: SampleFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  })
  const query = params.toString()
  return query ? `?${query}` : ''
}

export async function createSample(data: SampleFormValues, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sample`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao criar sample')
  }

  return res.json()
}

export async function getSamples(
  token: string,
  filters: SampleFilters = {}
) {
  const query = buildQuery(filters)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sample${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao buscar samples')
  }
  const data = await res.json()
  return data.items // <-- Retorna apenas o array de samples
}

export async function getSampleById(id: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sample/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao buscar sample')
  }
  return res.json()
}

export async function updateSample(
  id: string,
  data: any, // TODO: tipar SampleFormValues talvez faça ser obrigatorio mandar name já que no zod ele tá obrigatorio
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sample/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao atualizar sample')
  }
  return res.json()
}

export async function deleteSample(id: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sample/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao deletar sample')
  }
  // DELETE retorna 204 com body vazio (talvez com conteudo seja melhor)
  return
}
