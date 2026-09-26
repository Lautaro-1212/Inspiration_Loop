import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  StyleSheet, 
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// Si usas expo vector icons puedes descomentar la siguiente línea:
// import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const INNER_PADDING = 12;
// Calculamos el ancho exacto para 2 columnas simétricas dentro del contenedor
const GRID_WIDTH = width - (CONTAINER_PADDING * 2);
const CARD_WIDTH = (GRID_WIDTH - (INNER_PADDING * 2) - 12) / 2;

const IP = process.env.EXPO_PUBLIC_API_IP;

// --- COMPONENTE RENDER TARJETA (SIMÉTRICA COMO EL DISEÑO) ---
function RenderTarjeta({ item, index, onPress }) {
  const imageUri = item.imageUrl || item.image || item.uri;

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={styles.cardContainer}
    >
      {imageUri ? (
        <Image 
          source={typeof imageUri === 'string' ? { uri: imageUri } : imageUri} 
          style={styles.cardImage} 
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>imagen</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// --- CABECERA CON DATOS DEL PERFIL ---
function ProfileHeader({nombreUsuario = "Nombre del usuario" }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        <Image 
          // Si avatarUri existe, muestra la foto del usuario; si no, carga la imagen local .png
          source={
            require('../assets/Perfil2.png') 
          } 
          style={styles.avatarImage} 
        />
      </View>
      <Text style={styles.userName}>{nombreUsuario}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const [tarjetas, setTarjetas] = useState([]);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Paginación
  const [pagina, setPagina] = useState(1);
  const [hayMasPaginas, setHayMasPaginas] = useState(true);
  const LIMITE_POR_PAGINA = 10;

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  const obtenerImagenes = async (numeroPagina = 1, esRecarga = false) => {
    if (esRecarga) {
      setRefreshing(true);
    } else if (numeroPagina === 1) {
      setCargandoInicial(true);
    } else {
      setCargandoMas(true);
    }

    try {
      const API_URL = `https://${IP}/api/images/`;
      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok && data.mensaje) {
        const tarjetasFormateadas = data.mensaje.map((item) => {
          const filename = item.path ? item.path.split(/[/\\]/).pop() : '';
          const urlFinal = filename ? `http://${IP}/uploads/images/${filename}` : null;

          return {
            ...item,
            imageUrl: urlFinal
          };
        });

        if (tarjetasFormateadas.length < LIMITE_POR_PAGINA) {
          setHayMasPaginas(false);
        } else {
          setHayMasPaginas(true);
        }

        if (numeroPagina === 1 || esRecarga) {
          setTarjetas(tarjetasFormateadas);
        } else {
          setTarjetas(prev => [...prev, ...tarjetasFormateadas]);
        }

        setPagina(numeroPagina);
      } else {
        setHayMasPaginas(false);
      }
    } catch (error) {
      console.error("ERROR FETCH:", error);
    } finally {
      setCargandoInicial(false);
      setCargandoMas(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerImagenes(1);
    }, [])
  );

  const onRefresh = () => {
    obtenerImagenes(1, true);
  };

  const cargarMasImagenes = () => {
    if (!cargandoMas && hayMasPaginas && !cargandoInicial) {
      obtenerImagenes(pagina + 1);
    }
  };

  const abrirTarjeta = (item) => {
    setTarjetaSeleccionada(item);
    setModalVisible(true);
  };

  const obtenerCategorias = (item) => {
    if (!item?.categories && !item?.categoria) return [];
    const cat = item.categories || item.categoria;
    if (Array.isArray(cat)) return cat;
    try {
      return JSON.parse(cat);
    } catch {
      return [cat];
    }
  };

  const renderFooter = () => {
    if (!cargandoMas) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4A5260" />
      </View>
    );
  };

  const imageUriModal = tarjetaSeleccionada?.imageUrl || tarjetaSeleccionada?.image || tarjetaSeleccionada?.uri;
  const listaCategorias = tarjetaSeleccionada ? obtenerCategorias(tarjetaSeleccionada) : [];

  return (
    <View style={styles.screenContainer}>
      {cargandoInicial ? (
        <View style={[styles.screenContainer, styles.center]}>
          <ActivityIndicator size="large" color="#2C3240" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      ) : (
        <FlatList
          data={tarjetas}
          keyExtractor={(item, index) => item.id?.toString() || item._id?.toString() || index.toString()}
          
          // Renderiza el Perfil arriba
          ListHeaderComponent={<ProfileHeader />}
          
          renderItem={({ item, index }) => (
            <RenderTarjeta 
              item={item} 
              index={index} 
              onPress={abrirTarjeta} 
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.gridContainer}
          
          // Infinite Scroll
          onEndReached={cargarMasImagenes}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}

          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2A327D']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay imágenes en el perfil.</Text>
            </View>
          }
        />
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR (BOTTOM TAB BAR) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.barButton}>
          <Text style={styles.barIconText}>⌂</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barButton}>
          <Text style={styles.barIconText}>⊕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barButton}>
          <Text style={styles.barIconText}>⌕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barButton}>
          <Text style={[styles.barIconText, styles.activeIcon]}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DETALLADO */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity 
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}> ✕ Cerrar </Text>
          </TouchableOpacity>

          {tarjetaSeleccionada && (
            <ScrollView 
              contentContainerStyle={styles.modalScrollContent} 
              showsVerticalScrollIndicator={false}
            >
              {imageUriModal && (
                <Image 
                  source={{ uri: imageUriModal }} 
                  style={styles.fullImage} 
                  resizeMode="contain"
                />
              )}

              <View style={styles.modalInfoContainer}>
                <Text style={styles.modalTitle}>
                  {tarjetaSeleccionada.name || tarjetaSeleccionada.nombre || 'Sin título'}
                </Text>

                {listaCategorias.length > 0 && (
                  <View style={styles.categoriesWrapper}>
                    {listaCategorias.map((cat, idx) => (
                      <View key={idx} style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{cat}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.modalDescription}>
                  {tarjetaSeleccionada.description || tarjetaSeleccionada.descripcion || 'Sin descripción disponible.'}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ADADAD', // Fondo gris claro idéntico a la imagen
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#000',
    marginTop: 10,
    fontSize: 16,
  },
  // ESTILOS DEL PERFIL
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#ADADAD',
    overflow: 'hidden',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20,
  },
  // ESTILOS DE LA CUADRÍCULA (GRID)
  gridContainer: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    backgroundColor: '#959CA8', // Fondo del contenedor gris de las imágenes
    padding: INNER_PADDING,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.1, // Altura uniforme cuadrada/rectangular como el mockup
    backgroundColor: '#CBC2D8', // Tono lila pastel exacto al mockup
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#333',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#333',
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  // BOTTOM TAB BAR
  bottomBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#2A327D', // Azul oscuro del diseño
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  barButton: {
    padding: 10,
  },
  barIconText: {
    color: '#8A92D4',
    fontSize: 24,
  },
  activeIcon: {
    color: '#FFF',
  },
  // MODAL
  modalBackground: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 100,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  fullImage: {
    width: width * 0.85,
    height: 350,
    borderRadius: 12,
  },
  modalInfoContainer: {
    width: width * 0.85,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    color: '#000000',
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
    borderColor: '#CCC',
  },
  categoryBadgeText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
  },
  modalDescription: {
    color: '#333333',
    fontSize: 15,
    lineHeight: 22,
  },
});