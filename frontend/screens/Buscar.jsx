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
  ScrollView
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// --- DATOS ESTÁTICOS DE MUESTRA (PLACEHOLDERS) ---
const tarjetasPlaceholders = [
  {
    id: '1',
    name: 'Fondos de pantalla',
    image: require('../assets/fondospantalla.jpg'),
    description: 'Colección de fondos de pantalla HD y 4K.',
    categories: ['Wallpapers', 'Diseño'], 
    resizeMode:"cover",
    justifyContent:'center',
    alignItems:'center'
  },
  {
    id: '2',
    name: 'Ropa',
    image: require('../assets/ropa.webp'),
  },
  {
    id: '3',
    name: 'Programación',
    image: require('../assets/programacion.webp'),
  },
  {
    id: '4',
    name: 'Fotos de Perfil',
    image: require('../assets/fotoperfil.webp'),
  },
  {
    id: '5',
    name: 'Assets',
    image: require('../assets/asset.jpg'),
  },
  {
    id: '6',
    name: 'Anime',
    image: require('../assets/anime.avif'),
  },
  {
    id: '7',
    name: 'Comida',
    image: require('../assets/food.png'),
  },
  {
    id: '8',
    name: 'Paletas de colores',
    image:require('../assets/paletadecolores.avif') ,
  },
];

// --- COMPONENTE TARJETA ---
function RenderTarjeta({ item }) {
  const imageUri = item.image || item.imageUrl || item.uri;
  const cardTitle = item.name;

  return (
    <TouchableOpacity 
      activeOpacity={1}
      onPress={() => {}}
      style={[
        styles.cardContainer,
        item.borderColor ? { borderWidth: 2, borderColor: item.borderColor } : null
      ]}
    >
      {imageUri ? (
        <ImageBackground 
          source={typeof imageUri === 'string' ? { uri: imageUri } : imageUri} 
          style={styles.cardImageBackground}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitleOverlay}>{cardTitle}</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>{cardTitle}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
export default function HomeScreen() {
  const [tarjetas] = useState(tarjetasPlaceholders);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabActiva, setTabActiva] = useState('inicio');

  const [modalVisible, setModalVisible] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  const abrirTarjeta = (item) => {
    setTarjetaSeleccionada(item);
    setModalVisible(true);
  };

  const imageUriModal = tarjetaSeleccionada?.image || tarjetaSeleccionada?.imageUrl || tarjetaSeleccionada?.uri;

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
        />
      </View>

      {/* GRILLA DE 8 CATEGORÍAS */}
      <FlatList
        data={tarjetas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RenderTarjeta 
            item={item} 
            onSelectImage={abrirTarjeta} 
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTTOM NAV BAR */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => setTabActiva('inicio')}
          >
            <Text style={[styles.tabIcon, tabActiva === 'inicio' && styles.tabIconActive]}>🏠</Text>
            <Text style={[styles.tabLabel, tabActiva === 'inicio' && styles.tabLabelActive]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => setTabActiva('crear')}
          >
            <Text style={[styles.tabIcon, tabActiva === 'crear' && styles.tabIconActive]}>➕</Text>
            <Text style={[styles.tabLabel, tabActiva === 'crear' && styles.tabLabelActive]}>Crear</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => setTabActiva('buscar')}
          >
            <Text style={[styles.tabIcon, tabActiva === 'buscar' && styles.tabIconActive]}>🔍</Text>
            <Text style={[styles.tabLabel, tabActiva === 'buscar' && styles.tabLabelActive]}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => setTabActiva('perfil')}
          >
            <Text style={[styles.tabIcon, tabActiva === 'perfil' && styles.tabIconActive]}>👤</Text>
            <Text style={[styles.tabLabel, tabActiva === 'perfil' && styles.tabLabelActive]}>Perfil</Text>
          </TouchableOpacity>
        </View>
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
                <ImageBackground 
                  source={typeof imageUriModal === 'string' ? { uri: imageUriModal } : imageUriModal} 
                  style={styles.fullImage} 
                  resizeMode="cover"
                />
              )}

              <View style={styles.modalInfoContainer}>
                <Text style={styles.modalTitle}>{tarjetaSeleccionada.name}</Text>

                {tarjetaSeleccionada.categories && (
                  <View style={styles.categoriesWrapper}>
                    {tarjetaSeleccionada.categories.map((cat, idx) => (
                      <View key={idx} style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{cat}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.modalDescription}>
                  {tarjetaSeleccionada.description}
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
  container: {
    flex: 1,
    backgroundColor: '#A3A3A3', // Fondo gris idéntico al diseño
    paddingTop: 50,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  // TARJETAS
  cardContainer: {
    marginTop:30,
    width: CARD_WIDTH,
    height: 110,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#4A4A4A', // Color base si no hay imagen
  },
  cardImageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  cardTitleOverlay: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // BOTTOM NAV BAR
  bottomBarContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#8C919D',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingVertical: 6,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 18,
    color: '#1F2937',
  },
  tabIconActive: {
    color: '#2563EB',
  },
  tabLabel: {
    fontSize: 11,
    color: '#1F2937',
    marginTop: 1,
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },

  // MODAL DETALLE
  modalBackground: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalScrollContent: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fullImage: {
    width: width * 0.88,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalInfoContainer: {
    width: width * 0.88,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryBadgeText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  modalDescription: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 22,
  },
});