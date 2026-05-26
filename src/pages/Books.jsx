import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { G } from '../constants/theme'
import { fmt, fmtTime, fmtCurrency } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Icon from '../components/Icon'
import { Input, Label } from '../components/Input'

export default function Books({ user }) {
  const [tab, setTab] = useState('inventory')
  const [books, setBooks] = useState([])
  const [sales, setSales] = useState([])
  const [modal, setModal] = useState(false)
  const [saleModal, setSaleModal] = useState(false)
  const [bookForm, setBookForm] = useState({ title: '', author: '', price: '', stock: '' })
  const [cart, setCart] = useState([])
  const [payMethod, setPayMethod] = useState('cash')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const [{ data: b }, { data: s }] = await Promise.all([
      supabase.from('books').select('*').order('title'),
      supabase.from('sales').select('*').order('created_at', { ascending: false }),
    ])
    setBooks(b || [])
    setSales(s || [])
    setLoading(false)
  }

  const saveBook = async () => {
    if (!bookForm.title || !bookForm.price || !bookForm.stock) return
    setSaving(true)
    const { data, error } = await supabase.from('books').insert({ title: bookForm.title, author: bookForm.author, price: parseFloat(bookForm.price), stock: parseInt(bookForm.stock) }).select().single()
    if (!error) setBooks(p => [...p, data].sort((a, b) => a.title.localeCompare(b.title)))
    setBookForm({ title: '', author: '', price: '', stock: '' })
    setModal(false)
    setSaving(false)
  }

  const addToCart = (book) => {
    const ex = cart.find(c => c.book_id === book.id)
    if (ex) {
      if (ex.qty >= book.stock) return
      setCart(p => p.map(c => c.book_id === book.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      if (book.stock < 1) return
      setCart(p => [...p, { book_id: book.id, title: book.title, price: book.price, qty: 1 }])
    }
  }

  const removeFromCart = (bookId) => setCart(p => p.filter(c => c.book_id !== bookId))

  const recordSale = async () => {
    if (cart.length === 0) return
    setSaving(true)
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0)
    const { data: sale, error } = await supabase.from('sales').insert({ items: cart, total, payment_method: payMethod, recorded_by: user.name }).select().single()
    if (!error) {
      for (const item of cart) {
        const book = books.find(b => b.id === item.book_id)
        if (book) {
          const newStock = book.stock - item.qty
          await supabase.from('books').update({ stock: newStock }).eq('id', book.id)
          setBooks(p => p.map(b => b.id === book.id ? { ...b, stock: newStock } : b))
        }
      }
      setSales(p => [sale, ...p])
      setCart([])
      setPayMethod('cash')
      setSaleModal(false)
    }
    setSaving(false)
  }

  const delBook = async (id) => {
    await supabase.from('books').delete().eq('id', id)
    setBooks(p => p.filter(b => b.id !== id))
  }

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const totalRevenue = sales.reduce((s, sale) => s + Number(sale.total), 0)
  const totalCopiesSold = sales.reduce((s, sale) => s + sale.items.reduce((a, i) => a + i.qty, 0), 0)

  return (
    <div>
      <PageHeader title="Books" subtitle="Inventory and sales" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['inventory', 'sales'].map(t => (
          <Button key={t} variant={tab === t ? 'primary' : 'light'} size="sm" onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</Button>
        ))}
      </div>

      {tab === 'inventory' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {user.role === 'admin' && <Button icon="plus" onClick={() => setModal(true)}>Add Book</Button>}
            <Button variant="success" icon="receipt" onClick={() => setSaleModal(true)}>Record Sale</Button>
          </div>
          {loading ? <p style={{ color: G.textLight, textAlign: 'center', padding: 32 }}>Loading...</p> : books.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: 48 }}><div style={{ fontSize: 36, marginBottom: 10 }}>📚</div><p style={{ color: G.textLight }}>No books yet.</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {books.map(b => (
                <Card key={b.id} padding={14}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{b.title}</div>
                      {b.author && <div style={{ fontSize: 12, color: G.textLight }}>{b.author}</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{fmtCurrency(b.price)}</span>
                      <Badge color={b.stock > 5 ? 'green' : b.stock > 0 ? 'amber' : 'red'}>{b.stock} left</Badge>
                      {user.role === 'admin' && (
                        <button onClick={() => delBook(b.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.red }}><Icon name="trash" size={14} /></button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'sales' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <StatCard label="Total Revenue" value={fmtCurrency(totalRevenue)} color={G.green} />
            <StatCard label="Copies Sold" value={totalCopiesSold} color={G.primary} />
          </div>
          {sales.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: 48 }}><div style={{ fontSize: 36, marginBottom: 10 }}>🧾</div><p style={{ color: G.textLight }}>No sales yet.</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sales.map(sale => (
                <Card key={sale.id} padding={16}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Receipt #{String(sale.id).slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: 12, color: G.textLight }}>{fmtTime(sale.created_at)} · {sale.recorded_by}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: G.green }}>{fmtCurrency(sale.total)}</div>
                      <Badge color={sale.payment_method === 'cash' ? 'amber' : 'blue'}>{sale.payment_method}</Badge>
                    </div>
                  </div>
                  <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 8 }}>
                    {sale.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: G.textLight, padding: '2px 0' }}>
                        <span>{item.title} × {item.qty}</span>
                        <span>{fmtCurrency(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Book">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><Label>Title *</Label><Input value={bookForm.title} onChange={e => setBookForm(p => ({ ...p, title: e.target.value }))} placeholder="Book title" /></div>
          <div><Label>Author</Label><Input value={bookForm.author} onChange={e => setBookForm(p => ({ ...p, author: e.target.value }))} placeholder="Author name" /></div>
          <div><Label>Price (₦) *</Label><Input type="number" value={bookForm.price} onChange={e => setBookForm(p => ({ ...p, price: e.target.value }))} placeholder="0" /></div>
          <div><Label>Stock Count *</Label><Input type="number" value={bookForm.stock} onChange={e => setBookForm(p => ({ ...p, stock: e.target.value }))} placeholder="0" /></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={saveBook} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>{saving ? 'Saving...' : 'Add Book'}</Button>
            <Button variant="light" onClick={() => setModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal open={saleModal} onClose={() => { setSaleModal(false); setCart([]) }} title="Record Sale">
        <div>
          <Label>Select Books</Label>
          <div style={{ marginBottom: 16 }}>
            {books.filter(b => b.stock > 0).map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${G.border}` }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: G.textLight }}>{fmtCurrency(b.price)} · {b.stock} left</div>
                </div>
                <Button size="sm" icon="plus" onClick={() => addToCart(b)}>Add</Button>
              </div>
            ))}
            {books.filter(b => b.stock > 0).length === 0 && <p style={{ color: G.textLight, fontSize: 13 }}>No books in stock.</p>}
          </div>

          {cart.length > 0 && (
            <div style={{ background: G.grayLight, borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Cart</div>
              {cart.map(c => (
                <div key={c.book_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                  <span style={{ fontSize: 13 }}>{c.title} × {c.qty}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{fmtCurrency(c.price * c.qty)}</span>
                    <button onClick={() => removeFromCart(c.book_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.red }}><Icon name="x" size={14} /></button>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${G.border}`, marginTop: 8, paddingTop: 8, fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                <span>Total</span><span style={{ color: G.green }}>{fmtCurrency(cartTotal)}</span>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <Label>Payment Method</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['cash', 'transfer'].map(m => (
                <Button key={m} variant={payMethod === m ? 'primary' : 'light'} size="sm" onClick={() => setPayMethod(m)} style={{ flex: 1, justifyContent: 'center', textTransform: 'capitalize' }}>{m}</Button>
              ))}
            </div>
          </div>

          <Button variant="success" onClick={recordSale} disabled={cart.length === 0 || saving} style={{ width: '100%', justifyContent: 'center' }} icon="check">
            {saving ? 'Recording...' : 'Confirm Sale'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
