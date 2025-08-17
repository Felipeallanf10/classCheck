export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🎉 Bem-vindo ao Dashboard!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Login realizado com sucesso. Esta é uma página temporária para demonstrar o redirecionamento.
          </p>
          <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg p-4 mt-6">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✅ Autenticação simulada funcionando perfeitamente!
            </p>
            <p className="text-green-700 dark:text-green-300 text-sm mt-2">
              Em breve, esta página será substituída pelo dashboard real do ClassCheck.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
