import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const IP = process.env.EXPO_PUBLIC_API_IP;
const PORT = process.env.EXPO_PUBLIC_API_PORT;

// --- CATEGORÍAS PREDEFINIDAS ---
const tarjetasPlaceholders = [
  {
    id: '1',
    name: 'Fondos de pantalla',
    image: require('../assets/fondospantalla.jpg'),
    description: 'Colección de fondos de pantalla HD y 4K.',
    categories: ['Wallpapers', 'Diseño']
  },
  {
    id: '2',
    name: 'Ropa',
    image: require('../assets/ropa.webp'),
    categories: ['Moda', 'Diseño']
  },
  {
    id: '3',
    name: 'Programación',
    image: require('../assets/programacion.webp'),
    categories: ['Tecnología', 'Desarrollo']
  },
  {
    id: '4',
    name: 'Fotos de Perfil',
    image: require('../assets/fotoperfil.webp'),
    categories: ['Avatares', 'Redes sociales']
  },
  {
    id: '5',
    name: 'Assets',
    image: require('../assets/asset.jpg'),
    categories: ['Diseño', 'Recursos']
  },
  {
    id: '6',
    name: 'Anime',
    image: require('../assets/anime.avif'),
    categories: ['Anime', 'Ilustración']
  },
  {
    id: '7',
    name: 'Comida',
    image: require('../assets/food.png'),
    categories: ['Comida', 'Fotografía']
  },
  {
    id: '8',
    name: 'Paletas de colores',
    image: require('../assets/paletadecolores.avif'),
    categories: ['Colores', 'Diseño']
  }
];

// --- COMPONENTE TARJETA ---
function RenderTarjeta({ item, onSelectImage, imageSource }) {
  const imageUri =
    imageSource ??
    item.image ??
    item.imageUrl ??
    item.uri;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelectImage(item)}
      style={[
        styles.cardContainer,
        item.borderColor
          ? { borderWidth: 2, borderColor: item.borderColor }
          : null
      ]}
    >
      {imageUri ? (
        
        <ImageBackground
          source={
            typeof imageUri === 'string'
              ? { uri: imageUri }
              : imageUri
          }
          style={styles.cardImageBackground}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="contain"
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitleOverlay}>
              {item.name}
            </Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            {item.name}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// --- PANTALLA PRINCIPAL ---
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const [tabActiva, setTabActiva] = useState('inicio');
  const [modalVisible, setModalVisible] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  const API_URL = `https://${IP}/api/images/random`;

  // --- BUSCAR IMÁGENES ---
  const buscarImagenes = async () => {
    const termino = searchQuery.trim().toLowerCase();

    if (!termino) {
      setResultados([]);
      setMostrandoResultados(false);
      setErrorBusqueda('');
      return;
    }

    try {
      setCargando(true);
      setErrorBusqueda('');

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      
      const data = await response.json();

      const imagenes = Array.isArray(data.mensaje)
        ? data.mensaje
        : [];

      const imagenesFormateadas = imagenes.map((item) => {
        const filename = item.path
          ? item.path.split(/[\/\\]/).pop()
          : '';

        const urlFinal = filename
          ? `https://${IP}/uploads/images/${filename}`
          : null;

        return {
          ...item,
          imageUrl: urlFinal
        };
      });

      const coincidencias = imagenesFormateadas.filter((imagen) => {
        const nombre = (imagen.name ?? '').toLowerCase();
        const descripcion = (imagen.description ?? '').toLowerCase();

        return (
          nombre.includes(termino) ||
          descripcion.includes(termino)
        );
      });

      setResultados(coincidencias);
      setMostrandoResultados(true);

      console.log('IP:', IP);
      console.log('Ruta original:', imagenes[0]?.path);
      console.log('URL de imagen:', imagenesFormateadas[0]?.imageUrl);
    } catch (error) {
      console.error('Error buscando imágenes:', error);
      setErrorBusqueda('No se pudieron cargar las imágenes.');
    } finally {
      setCargando(false);
    }
  };
  
  // --- VOLVER A LAS CATEGORÍAS ---
  const volverACategorias = () => {
    setSearchQuery('');
    setResultados([]);
    setMostrandoResultados(false);
    setErrorBusqueda('');
  };

  // --- ABRIR MODAL ---
  const abrirTarjeta = (item) => {
    setTarjetaSeleccionada(item);
    setModalVisible(true);
  };

  const imageUriModal =
    tarjetaSeleccionada?.imageUrl ??
    tarjetaSeleccionada?.image ??
    tarjetaSeleccionada?.uri ??
    (tarjetaSeleccionada?.path
      ? tarjetaSeleccionada.path.startsWith('http')
        ? tarjetaSeleccionada.path
        : `https://${IP}${
            PORT ? `:${PORT}` : ''
          }/${tarjetaSeleccionada.path.replace(/^\/+/, '')}`
      : null);

  // --- CONSTRUIR URL DE IMAGEN ---
  const obtenerImagen = (item) => {
    if (item.image || item.imageUrl || item.uri) {
      return item.image ?? item.imageUrl ?? item.uri;
    }

    if (item.path) {
      if (item.path.startsWith('http')) {
        return item.path;
      }

      return `https://${IP}${
        PORT ? `:${PORT}` : ''
      }/${item.path.replace(/^\/+/, '')}`;
    }

    return null;
  };

  return (
    <View style={styles.container}>

      {/* BARRA DE BÚSQUEDA */}
      <View style={styles.searchBarContainer}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Loopsies"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={buscarImagenes}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={volverACategorias}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* GRILLA */}
      {cargando ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#666" />
          <Text style={styles.emptyDescription}>
            Buscando imágenes...
          </Text>
        </View>
      ) : errorBusqueda ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyDescription}>
            {errorBusqueda}
          </Text>
        </View>
      ) : (
        <FlatList
          data={
            mostrandoResultados
              ? resultados
              : tarjetasPlaceholders
          }
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <RenderTarjeta
              item={item}
              imageSource={
                mostrandoResultados
                  ? obtenerImagen(item)
                  : undefined
              }
              onSelectImage={abrirTarjeta}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            mostrandoResultados ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                  No se encontraron imágenes
                </Text>
                <Text style={styles.emptyDescription}>
                  Probá con otro nombre o categoría.
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* BOTTOM NAV BAR */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          {[
            { id: 'inicio', icon: '🏠', label: 'Inicio' },
            { id: 'crear', icon: '➕', label: 'Crear' },
            { id: 'buscar', icon: '🔍', label: 'Buscar' },
            { id: 'perfil', icon: '👤', label: 'Perfil' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => setTabActiva(tab.id)}
            >
              <Text
                style={[
                  styles.tabIcon,
                  tabActiva === tab.id && styles.tabIconActive
                ]}
              >
                {tab.icon}
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  tabActiva === tab.id && styles.tabLabelActive
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* MODAL DETALLADO */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>
              ✕ Cerrar
            </Text>
          </TouchableOpacity>

          {tarjetaSeleccionada && (
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {imageUriModal && (
                <ImageBackground
                  source={
                    typeof imageUriModal === 'string'
                      ? { uri: imageUriModal }
                      : imageUriModal
                  }
                  style={styles.fullImage}
                  imageStyle={{ borderRadius: 12 }}
                  resizeMode="contain"
                />
              )}

              <View style={styles.modalInfoContainer}>
                <Text style={styles.modalTitle}>
                  {tarjetaSeleccionada.name}
                </Text>

                {tarjetaSeleccionada.categories?.length > 0 && (
                  <View style={styles.categoriesWrapper}>
                    {tarjetaSeleccionada.categories.map((cat, idx) => (
                      <View
                        key={idx}
                        style={styles.categoryBadge}
                      >
                        <Text style={styles.categoryBadgeText}>
                          {typeof cat === 'string' ? cat : cat.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.modalDescription}>
                  {tarjetaSeleccionada.description ??
                    'Sin descripción disponible.'}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

// --- ESTILOS ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Búsqueda
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#292929',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
  },

  // Grilla
  listPadding: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardContainer: {
  width: CARD_WIDTH,
  height: CARD_WIDTH,
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: '#000000',
  marginTop: 6,
  },
  cardImageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  cardTitleOverlay: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 10,
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },

  // Estados de carga y resultados vacíos
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 30,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#AAAAAA',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },

  // Barra de navegación inferior
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#292929',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.65,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    color: '#888888',
    fontSize: 11,
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Modal de información
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalScrollContent: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#043ca4',
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fullImage: {
    width: width * 0.85,
    height: 350,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginTop:30
  },
  modalInfoContainer: {
    width: width * 0.85,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  categoryBadgeText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
  },
  modalDescription: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
});
