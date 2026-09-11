import test from 'node:test'
import assert from 'node:assert/strict'

test('custom orders reject non-integer quantities', async () => {
  const res = await fetch('http://localhost:8787/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Custom Tester',
      email: 'custom@example.com',
      address: 'Atelier Lane',
      city: 'Pokhara',
      items: [
        {
          id: 'custom-bespoke',
          isCustom: true,
          price: 180000,
          quantity: 1.5,
          name: 'Bespoke Polex Commission',
          customSpecs: { case: 'steel' }
        }
      ]
    })
  })

  assert.equal(res.status, 400)
  const data = await res.json()
  assert.equal(data.message, 'One or more bag items are invalid.')
})
