import { useRoute } from '../lib/router'
import { RecipeList } from './RecipeList'
import { RecipeDetail } from './RecipeDetail'
import { RecipeForm } from './RecipeForm'

export function App() {
  const route = useRoute()

  return (
    <div class="app">
      <header class="app-header">
        <h1>Bake Lady</h1>
      </header>
      <main class="app-main">
        {route.type === 'home' && <RecipeList />}
        {route.type === 'detail' && <RecipeDetail id={route.id} />}
        {route.type === 'new' && <RecipeForm />}
        {route.type === 'edit' && <RecipeForm id={route.id} />}
      </main>
    </div>
  )
}
