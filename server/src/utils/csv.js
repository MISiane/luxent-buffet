function escapeCell(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function toCsv(headers, rows) {
  const headerLine = headers.map(escapeCell).join(',')
  const bodyLines = rows.map((row) => row.map(escapeCell).join(','))
  return [headerLine, ...bodyLines].join('\r\n')
}